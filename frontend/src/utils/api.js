class Api {
    constructor({ baseUrl, headers }) {
        this._baseUrl = baseUrl;
        this._headers = headers;
    }

    _checkResponse(res) {
        if (!res.ok) {
            return Promise.reject(`${res.status} error!`);
          }
          return res.json();
        }
      

    getCardsList() {
        return fetch(`${this._baseUrl}/cards`, {
            headers: this._headers
        }).then(res => this._checkResponse(res));
    }

    
    getUserInfo() {
        return fetch(`${this._baseUrl}/users/me`, {
            headers: this._headers
        }).then(res => this._checkResponse(res));
    }

    editProfile({ name, about }) {
        return fetch(`${this._baseUrl}/users/me`, {
            method: "PATCH",
            headers: this._headers,
            body: JSON.stringify({
                name,
                about,
            })
        }).then(res => this._checkResponse(res));
    }

    getProfile() {
        return fetch(`${this._baseUrl}/users/me`, {
            headers: this._headers
        }).then(res => this._checkResponse(res));
    }

    addCard({ name, link }) {
        return fetch(`${this._baseUrl}/cards`, {
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify({
                name,
                link,
            })
        }).then(res => this._checkResponse(res));
    }

     likeCard(cardId) {
         return fetch(`${this._baseUrl}/cards/likes/${cardId}`, {
             method: 'PUT',
             headers: this._headers,
            }).then(res => this._checkResponse(res));
     }
    
     removeLike(cardId) {
        return fetch(`${this._baseUrl}/cards/likes/${cardId}`, {
            method: 'DELETE',
            headers: this._headers,
        }).then(res => this._checkResponse(res));
    }
    
     setUserAvatar(url) {
        return fetch(`${this._baseUrl}/users/me/avatar`, {
          method: 'PATCH',
          headers: this._headers,
            body: JSON.stringify({
                avatar: url,
            }),
        }).then(res => this._checkResponse(res));
     }
    
     deleteCard(cardId) {
        return fetch(`${this._baseUrl}/cards/${cardId}`, {
          method: 'DELETE',
          headers: this._headers,
        }).then(res => this._checkResponse(res));
    }  
    
     changeLikeCardStatus(cardId, isLiked) {
        const method = !isLiked ? 'DELETE' : 'PUT';
        return fetch(`${this._baseUrl}/cards/likes/${cardId}`, {
            method: method,
            headers: this._headers,
        }).then(res => this._checkResponse(res));
    }
};


const api = new Api({
    baseUrl: "https://around.nomoreparties.co/v1/cohort-3-en",
    headers: {
        Authorization: '42b9ea6f-407e-4ca1-96e0-0f09ff65d270',
      "Content-Type": "application/json"
    }
})

export default api;
