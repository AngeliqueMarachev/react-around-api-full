import React from "react";
import { Switch, Route, useHistory } from "react-router-dom";

import "../index.css";

import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import PopupWithForm from "./PopupWithForm";
import ImagePopup from "./ImagePopup";

import { CurrentUserContext } from "../contexts/CurrentUserContext";
import api from "../utils/api";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import * as auth from "../utils/auth";
import Login from "./Login";
import Register from "./Register";
import ProtectRoute from "./ProtectedRoute";
import InfoToolTip from "./InfoTooltip";
import failIcon from "../images/fail_icon.svg";

function App() {
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
    React.useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = React.useState(false);

  const [selectedCard, setSelectedCard] = React.useState(null);
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [token, setToken] = React.useState(localStorage.getItem("jwt"));

  const [isSuccess, setIsSuccess] = React.useState(true);

  const history = useHistory();

  React.useEffect(() => {
    if (isLoggedIn) {
      api
        .getUserInfo()
        .then((user) => {
          setCurrentUser(user);
        })
        .catch((err) => console.log(err));
    }
  }, [isLoggedIn]);

  React.useEffect(() => {
    if (isLoggedIn) {
      api
        .getCardsList(token)
        .then((res) => {
          setCards(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, [token, isLoggedIn]);

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((user) => {
      return user === currentUser._id;
    });
    api
      .changeLikeCardStatus(card._id, isLiked)

      .then((newCard) => {
        setCards((state) =>
          state.map((currentCard) =>
            currentCard._id === card._id ? newCard : currentCard
          )
        );
      })
      .catch((err) => console.log("something went wrong", err));
  }

  function handleCardDelete(card) {
    setIsLoading(true);
    api
      .deleteCard(card._id)
      .then(() => {
        setCards(cards.filter((stateCard) => stateCard !== card));
        closeAllPopups();
      })
      .catch(() => console.log("something went wrong"))
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleUpdateUser({ name, about }) {
    setIsLoading(true);
    api
      .editProfile({ name, about })
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch(() => console.log("something went wrong"))
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleUpdateAvatar({ avatar }) {
    setIsLoading(true);
    api
      .setUserAvatar(avatar)
      .then((res) => {
        setCurrentUser({
          ...currentUser,
          avatar: res.avatar,
        });
        closeAllPopups();
      })
      .catch(() => console.log("something went wrong"))
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleAddPlaceSubmit(name, url) {
    setIsLoading(true);
    api
      .addCard(name, url)
      .then((res) => {
        console.log("line180", res);
        setCards([res.data, ...cards]);
        closeAllPopups();
      })
      .catch(() => console.log("something went wrong"))
      .finally(() => {
        setIsLoading(false);
      });
  }

  function onRegister({ email, password }) {
    auth
      .register(email, password)
      .then((res) => {
        if (res) {
          setIsSuccess("success");
          const timer = setTimeout(() => {
            setIsInfoTooltipOpen(true);
            history.push("/signin");
            clearTimeout(timer);
          }, 1000);
        } else {
          setIsSuccess("fail");
        }
      })
      .catch((err) => {
        setIsSuccess("fail");
        setIsInfoTooltipOpen(true);
      });
  }

  function onLogin({ email, password }) {
    auth
      .login(email, password)
      .then((res) => {
        if (res) {
          setIsLoggedIn(true);
          setEmail(email);
          setCurrentUser(res.user);
          setToken(res.token);
          localStorage.setItem("jwt", res.token);
          history.push("/");
        } else {
          setIsSuccess("fail");
          setIsInfoTooltipOpen(true);
          setTimeout(() => {
            history.push("/signup");
            setIsInfoTooltipOpen(false);
          }, 1000);
        }
      })
      .catch((err) => {
        setIsSuccess("fail");
        setIsInfoTooltipOpen(true);
      });
  }

  React.useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      auth
        .checkToken(token)
        .then((res) => {
          if (res._id) {
            setEmail(res.email);
            setIsLoggedIn(true);
            history.push("/");
          }
        })
        .catch((err) => console.log(err));
    } else {
      history.push("/signin");
    }
  }, [history]);

  function signOut() {
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
    setEmail("");
    history.push("/signin");
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard(null);
    setIsInfoTooltipOpen(false);
  }

  React.useEffect(() => {
    const isPopupOpened =
      isEditProfilePopupOpen ||
      isEditAvatarPopupOpen ||
      isAddPlacePopupOpen ||
      isInfoTooltipOpen ||
      selectedCard;
    if (!isPopupOpened) {
      return;
    }
    const closeByEscape = (e) => {
      if (e.key === "Escape") {
        closeAllPopups();
      }
    };
    document.addEventListener("keydown", closeByEscape);
    return () => document.removeEventListener("keydown", closeByEscape);
  }, [
    isEditProfilePopupOpen,
    isEditAvatarPopupOpen,
    isAddPlacePopupOpen,
    isInfoTooltipOpen,
    selectedCard,
  ]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header
          loggedIn={isLoggedIn}
          path="/signup"
          email={email}
          signOut={signOut}
        />
        <Switch>
          <ProtectRoute exact path="/" loggedIn={isLoggedIn}>
            <Main
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
              onEditAvatarClick={handleEditAvatarClick}
              onEditProfileClick={handleEditProfileClick}
              onAddPlaceClick={handleAddPlaceClick}
              onCardClick={handleCardClick}
              cards={cards}
            />

            <EditProfilePopup
              isOpen={isEditProfilePopupOpen}
              onClose={closeAllPopups}
              onUpdateUser={handleUpdateUser}
              isLoading={isLoading}
            />

            <AddPlacePopup
              isOpen={isAddPlacePopupOpen}
              onClose={closeAllPopups}
              onAddPlaceSubmit={handleAddPlaceSubmit}
              isLoading={isLoading}
            />

            <EditAvatarPopup
              isOpen={isEditAvatarPopupOpen}
              onClose={closeAllPopups}
              onUpdateAvatar={handleUpdateAvatar}
              isLoading={isLoading}
            />

            <PopupWithForm
              title="Are you sure?"
              name="delete-confirm"
              buttonText="Yes"
              onClose={closeAllPopups}
            ></PopupWithForm>

            <ImagePopup card={selectedCard} onClose={closeAllPopups} />

            <Footer />
          </ProtectRoute>

          <Route path="/signin" loggedIn={isLoggedIn}>
            <Login onRegister={onLogin} />
          </Route>

          <Route path="/signup" loggedIn={isLoggedIn}>
            <Register onRegister={onRegister} />
          </Route>

          {/* <Route>
            {isLoggedIn ? <Redirect to="/" /> : <Redirect to="/signin" />}
          </Route> */}

        </Switch>
        <InfoToolTip
          isOpen={isInfoTooltipOpen}
          isSuccess={isSuccess}
          onClose={closeAllPopups}
          action={"logged in"}
          image={failIcon}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
