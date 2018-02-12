"use strict";

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Cookies = {
  set: function set(name, value, expiry_days) {
    var d = new Date();
    d.setTime(d.getTime() + expiry_days * 24 * 60 * 60 * 1000);
    document.cookie = "X-" + name + "=" + value + "; expires=" + d.toGMTString() + "; path=/";
  },
  get: function get(name) {
    name = "X-" + name + "=";
    var cookies = document.cookie.split(';');

    for (var i = cookies.length - 1; i >= 0; i--) {
      var cookie = cookies[i].trim();
      if (cookie.indexOf(name) == 0) {
        return cookie.substring(name.length, cookie.length);
        break;
      }
    }

    return false;
  },
  delete: function _delete(name) {
    document.cookie = 'X-' + name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
  }
};

var Upload = {
  headers: function headers() {
    return {
      'Accept': 'application/json',
      'X-Session-Secret': Cookies.get('Session-Secret')
    };
  },
  upload: function upload(file) {
    var data = new FormData();
    data.append("file", file);

    return fetch('/_upload', {
      headers: this.headers(),
      credentials: 'include',
      method: 'POST',
      body: data
    }).then(function (response) {
      if (response.ok) {
        return response.json().then(function (json) {
          return json;
        });
      } else {
        return response.json().then(function (json) {
          console.error(json);
        });
      }
    });
  }
};

var Model = function () {
  function Model() {
    _classCallCheck(this, Model);

    this.attributes = {};
  }

  _createClass(Model, [{
    key: "headers",
    value: function headers() {
      return {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Session-Secret': Cookies.get('Session-Secret')
      };
    }
  }, {
    key: "fetch",
    value: function (_fetch) {
      function fetch() {
        return _fetch.apply(this, arguments);
      }

      fetch.toString = function () {
        return _fetch.toString();
      };

      return fetch;
    }(function () {
      var _this = this;

      return fetch(lang_route + this.endpoint + '/' + this.id, {
        headers: this.headers(),
        credentials: 'include',
        method: 'GET'
      }).then(function (response) {
        if (response.ok) {
          return response.json().then(function (json) {
            _this.id = json._id;
            _this.attributes = json;

            return _this;
          });
        } else {
          return response.json().then(function (json) {

            throw new Error(json.message + ": " + json.description);
          });
        }
      }).then(function (json) {
        _this.attributes = json;
        return _this;
      });
    })
  }, {
    key: "save",
    value: function save(data) {
      var _this2 = this;

      var url = lang_route + this.endpoint;
      var method = 'POST';

      if (this.id) {
        url += '/' + this.id;
        method = 'PUT';
      }

      return fetch(url, {
        headers: this.headers(),
        method: method,
        credentials: 'include',
        body: JSON.stringify(data)
      }).then(function (response) {
        if (response.ok) {
          return response.json().then(function (json) {
            _this2.id = json._id;
            _this2.attributes = json;

            return _this2;
          });
        } else {
          return response.json().then(function (json) {

            throw new Error(json.message + ": " + json.description);
          });
        }
      });
    }
  }, {
    key: "destroy",
    value: function destroy() {
      var _this3 = this;

      return fetch(lang_route + this.endpoint + '/' + this.id, {
        headers: this.headers(),
        credentials: 'include',
        method: 'DELETE'
      }).then(function (response) {
        if (response.ok) {
          return response.json().then(function (json) {
            _this3.id = undefined;
            _this3.attributes = {};

            return _this3;
          });
        } else {
          return response.json().then(function (json) {

            throw new Error(json.message + ": " + json.description);
          });
        }
      });
    }
  }]);

  return Model;
}();

var Author = function (_Model) {
  _inherits(Author, _Model);

  function Author() {
    _classCallCheck(this, Author);

    var _this4 = _possibleConstructorReturn(this, (Author.__proto__ || Object.getPrototypeOf(Author)).call(this));

    _this4.endpoint = "founders";
    return _this4;
  }

  return Author;
}(Model);

var Piece = function (_Model2) {
  _inherits(Piece, _Model2);

  function Piece() {
    _classCallCheck(this, Piece);

    var _this5 = _possibleConstructorReturn(this, (Piece.__proto__ || Object.getPrototypeOf(Piece)).call(this));

    _this5.endpoint = "pieces";
    return _this5;
  }

  return Piece;
}(Model);

var Project = function (_Model3) {
  _inherits(Project, _Model3);

  function Project() {
    _classCallCheck(this, Project);

    var _this6 = _possibleConstructorReturn(this, (Project.__proto__ || Object.getPrototypeOf(Project)).call(this));

    _this6.endpoint = "projects";
    return _this6;
  }

  return Project;
}(Model);

var Session = function (_Model4) {
  _inherits(Session, _Model4);

  function Session() {
    _classCallCheck(this, Session);

    var _this7 = _possibleConstructorReturn(this, (Session.__proto__ || Object.getPrototypeOf(Session)).call(this));

    _this7.endpoint = "sessions";


    _this7.id = Cookies.get("Session-Id");
    return _this7;
  }

  _createClass(Session, [{
    key: "login",
    value: function login(data) {
      var _this8 = this;

      return this.save(data).then(function () {
        Cookies.set("Session-Id", _this8.attributes._id);
        Cookies.set("Session-Secret", _this8.attributes.secret);
        Cookies.set("User-Id", _this8.attributes.user_id);

        return _this8;
      });
    }
  }, {
    key: "logout",
    value: function logout() {
      var _this9 = this;

      return this.destroy().then(function () {
        Cookies.delete("Session-Id");
        Cookies.delete("Session-Secret");
        Cookies.delete("User-Id");
        Cookies.delete("Token-Id");

        return _this9;
      });
    }
  }]);

  return Session;
}(Model);

var User = function (_Model5) {
  _inherits(User, _Model5);

  function User() {
    _classCallCheck(this, User);

    var _this10 = _possibleConstructorReturn(this, (User.__proto__ || Object.getPrototypeOf(User)).call(this));

    _this10.endpoint = "users";


    _this10.id = Cookies.get("User-Id");
    return _this10;
  }

  return User;
}(Model);

var Overlay = function (_React$Component) {
  _inherits(Overlay, _React$Component);

  function Overlay(props) {
    _classCallCheck(this, Overlay);

    var _this11 = _possibleConstructorReturn(this, (Overlay.__proto__ || Object.getPrototypeOf(Overlay)).call(this, props));

    _this11.noscroll = true;

    _this11.state = {
      showed: false
    };

    _this11.toggle = _this11.toggle.bind(_this11);
    _this11.hide = _this11.hide.bind(_this11);
    return _this11;
  }

  _createClass(Overlay, [{
    key: "componentDidMount",
    value: function componentDidMount() {}
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {}
  }, {
    key: "toggle",
    value: function toggle(e) {
      if (e) {
        e.preventDefault();
        if (e.currentTarget && e.currentTarget.blur) {
          e.currentTarget.blur();
        }
      }

      if (this.noscroll) {
        document.documentElement.classList.toggle("noscroll");
      }
      this.setState({ showed: !this.state.showed });
    }
  }, {
    key: "hide",
    value: function hide(e) {
      if (this.state.showed) {
        if (this.noscroll) {
          document.documentElement.classList.remove("noscroll");
        }
        this.setState({ showed: false });
      }
    }
  }]);

  return Overlay;
}(React.Component);

var Account = function (_Overlay) {
  _inherits(Account, _Overlay);

  function Account(props) {
    _classCallCheck(this, Account);

    var _this12 = _possibleConstructorReturn(this, (Account.__proto__ || Object.getPrototypeOf(Account)).call(this, props));

    _this12.state = {
      session: new Session(),
      showed: false
    };

    _this12.file = document.createElement("input");
    _this12.file.type = "file";

    _this12.login = _this12.login.bind(_this12);
    _this12.logout = _this12.logout.bind(_this12);
    _this12.save = _this12.save.bind(_this12);
    _this12.input = _this12.input.bind(_this12);
    _this12.click = _this12.click.bind(_this12);
    _this12.upload = _this12.upload.bind(_this12);
    return _this12;
  }

  _createClass(Account, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      _get(Account.prototype.__proto__ || Object.getPrototypeOf(Account.prototype), "componentDidMount", this).call(this);

      if (this.state.session.id) {
        this.fetchUser();
      }

      document.addEventListener("input", this.input);
      document.addEventListener("click", this.click);
      this.file.addEventListener("change", this.upload);

      key("command+s,ctrl+s", this.save);
      key("escape", this.toggle);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      _get(Account.prototype.__proto__ || Object.getPrototypeOf(Account.prototype), "componentWillUnmount", this).call(this);

      document.removeEventListener("input", this.input);
      document.removeEventListener("click", this.click);
      this.file.removeEventListener("change", this.upload);

      key.unbind("command+s,ctrl+s", this.save);
      key.unbind("escape", this.toggle);
    }
  }, {
    key: "fetchUser",
    value: function fetchUser() {
      var _this13 = this;

      var user = new User();
      user.fetch().then(function (user) {
        _this13.setState({ user: user, showed: true });
      });

      window.user = user;
    }
  }, {
    key: "login",
    value: function login(e, state) {
      var _this14 = this;

      this.state.session.login(state).then(function (session) {
        _this14.setState({ session: session });
        Turbolinks.visit(window.location.pathname);
      });
    }
  }, {
    key: "logout",
    value: function logout(e) {
      var _this15 = this;

      this.state.session.logout().then(function (session) {
        _this15.setState({ session: new Session(), user: null });
        Turbolinks.visit(window.location.pathname);
      });
    }
  }, {
    key: "click",
    value: function click(e) {
      // if (this.state.session.id && e.target.localName == "img") {
      //   this.file.key = e.target.getAttribute("data-key")
      //   // this.file.piece = e.target.getAttribute("data-piece")
      //   // this.file.author = e.target.getAttribute("data-author")
      //   // this.file.project = e.target.getAttribute("data-project")
      //   this.file.target = e.target

      //   if (this.file.piece || this.file.author || this.file.project) {
      //     this.file.dispatchEvent(new MouseEvent("click"))  
      //   }
      // }
    }
  }, {
    key: "input",
    value: function input(e) {
      var key = e.target.getAttribute("data-key");
      // let piece = e.target.getAttribute("data-piece")
      // let author = e.target.getAttribute("data-author")
      // let project = e.target.getAttribute("data-project")

      // if (piece) {
      //   if (!this.state.pieces[piece]) { this.state.pieces[piece] = {} }
      //   this.state.pieces[piece][key] = e.target.innerHTML

      //   this.setState({
      //     pieces: this.state.pieces
      //   })
      // } else if (author) {
      //   if (!this.state.authors[author]) { this.state.authors[author] = {} }
      //   this.state.authors[author][key] = e.target.innerHTML

      //   this.setState({
      //     authors: this.state.authors
      //   })
      // } else if (project) {
      //   if (!this.state.projects[project]) { this.state.projects[project] = {} }
      //   this.state.projects[project][key] = e.target.innerHTML

      //   this.setState({
      //     projects: this.state.projects
      //   })
      // }
    }
  }, {
    key: "upload",
    value: function upload(e) {
      var _this16 = this;

      var file = e.currentTarget.files[0];
      if (file.type.match('image.*')) {
        if (Turbolinks) {
          Turbolinks.controller.adapter.progressBar.setValue(0);
          Turbolinks.controller.adapter.progressBar.show();
        }

        Upload.upload(file).then(function (response) {

          // if (this.file.piece) {
          //   if (!this.state.pieces[this.file.piece]) { this.state.pieces[this.file.piece] = {} }
          //   this.state.pieces[this.file.piece][this.file.key] = response.url

          //   this.setState({
          //     pieces: this.state.pieces
          //   })
          // } else if (this.file.author) {
          //   if (!this.state.authors[this.file.author]) { this.state.authors[this.file.author] = {} }
          //   this.state.authors[this.file.author][this.file.key] = response.url

          //   this.setState({
          //     authors: this.state.authors
          //   })
          // } else if (this.file.project) {
          //   if (!this.state.projects[this.file.project]) { this.state.projects[this.file.project] = {} }
          //   this.state.projects[this.file.project][this.file.key] = response.url

          //   this.setState({
          //     projects: this.state.projects
          //   })
          // }

          _this16.file.target.setAttribute("src", "https://montrealuploads.imgix.net" + response.url);

          if (Turbolinks) {
            Turbolinks.controller.adapter.progressBar.setValue(100);
            Turbolinks.controller.adapter.progressBar.hide();
          }
        });
      }
    }
  }, {
    key: "save",
    value: function save(e) {
      // if (Object.keys(this.state.pieces).length + Object.keys(this.state.authors).length + Object.keys(this.state.projects).length !== 0) {
      //   if (e) {
      //     e.preventDefault()
      //   }

      //   if (Turbolinks) {
      //     Turbolinks.controller.adapter.progressBar.setValue(0)
      //     Turbolinks.controller.adapter.progressBar.show()
      //   }

      //   let saves = []

      // for (let [_id, content] of Object.entries(this.state.pieces)) {
      //   for (let [key, value] of Object.entries(content)) {
      //     content[key] = value
      //   }

      //   let piece = new Piece()
      //   piece.id = _id
      //   saves.push(piece.save({ content: content }))
      // }

      // for (let [_id, attributes] of Object.entries(this.state.authors)) {
      //   let author = new Author()
      //   author.id = _id
      //   saves.push(author.save(attributes))
      // }

      // for (let [_id, attributes] of Object.entries(this.state.projects)) {
      //   let project = new Project()
      //   project.id = _id
      //   saves.push(project.save(attributes))
      // }

      //   Promise.all(saves).then((models)=> {
      //     if (Turbolinks) {
      //       Turbolinks.controller.adapter.progressBar.setValue(100)
      //       Turbolinks.controller.adapter.progressBar.hide()
      //     }

      //     // this.setState({
      //     //   pieces: {},
      //     //   authors: {},
      //     //   projects: {}
      //     // })
      //   })
      // }
    }
  }, {
    key: "render",
    value: function render() {
      // console.log(this.state.pieces)
      return React.createElement(
        "div",
        { className: "overlay" + (this.state.showed ? " overlay--show" : "") },
        React.createElement(Button, { className: "button--transparent overlay__back", onClick: this.hide }),
        React.createElement(
          "div",
          { className: "padded padded--tight overlay__container" },
          this.state.session.id && React.createElement(
            "div",
            { className: "grid grid--middle grid--spaced_around" },
            React.createElement(Button, { className: "button--transparent", label: "Logout", onClick: this.logout })
          ) || React.createElement(
            Form,
            { onSubmit: this.login, action: "POST", className: "col col--14of20 col--tablet_portrait--16of20 col--phone--18of20" },
            React.createElement(Input, { name: "email", type: "email", label: "Email address", placeholder: "email.address@gmail.com", required: true }),
            React.createElement(Input, { name: "password", type: "password", label: "Password", placeholder: "********", required: true }),
            React.createElement(Button, { label: "Log in" })
          )
        )
      );
    }
  }]);

  return Account;
}(Overlay);

var Button = function Button(props) {
  return React.createElement(
    "button",
    {
      className: props.className,
      disabled: props.disabled ? true : false,
      onClick: function onClick(e) {
        e.currentTarget.blur();
        if (props.onClick) {
          props.onClick(e);
        }
      } },
    props.label
  );
};

var Form = function (_React$Component2) {
  _inherits(Form, _React$Component2);

  function Form() {
    _classCallCheck(this, Form);

    return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
  }

  _createClass(Form, [{
    key: "onSubmit",
    value: function onSubmit(e) {
      if (this.props.onSubmit) {
        e.preventDefault();
        this.props.onSubmit(e, this.state);
      }
    }
  }, {
    key: "onChange",
    value: function onChange(e) {
      this.setState(_defineProperty({}, e.currentTarget.name, e.currentTarget.value));
    }
  }, {
    key: "render",
    value: function render() {
      var _this18 = this;

      return React.createElement(
        "form",
        { className: this.props.className, action: this.props.action, method: this.props.method,
          onSubmit: this.onSubmit.bind(this) },
        React.Children.map(this.props.children, function (child) {
          return React.cloneElement(child, { onChange: _this18.onChange.bind(_this18) });
        })
      );
    }
  }]);

  return Form;
}(React.Component);

var Input = function Input(props) {
  return React.createElement(
    "p",
    null,
    props.label && React.createElement(
      "label",
      { htmlFor: props.name },
      props.label
    ),
    React.createElement("input", { id: props.name,
      className: props.className,
      name: props.name,
      type: props.type ? props.type : 'text',
      defaultValue: props.value,
      min: props.min,
      max: props.max,
      placeholder: props.placeholder,
      required: props.required ? true : false,
      autoFocus: props.autofocus ? true : false,
      onChange: props.onChange })
  );
};

window.Core = {
  init: function init() {
    console.log('c:c:');
    this.render();
  },
  render: function render() {
    var data = {};
    var element = null;
    for (var i = window.components.length - 1; i >= 0; i--) {
      data = window.components[i]["data"];
      element = document.querySelectorAll(window.components[i]["element"])[0];
      element.setAttribute("data-component", window.components[i]["component"]);

      ReactDOM.render(React.createElement(window[window.components[i]["component"]], data), element);
    }
  },
  destroy: function destroy() {
    var elements = document.querySelectorAll("[data-component]");
    if (elements.length > 0) {
      for (var i = elements.length - 1; i >= 0; i--) {
        if (!elements[i].hasAttribute("data-turbolinks-permanent")) {
          ReactDOM.unmountComponentAtNode(elements[i]);
        }
      }
    }
  }
};

window.Core.init();
document.addEventListener("turbolinks:load", function () {
  window.Core.render();
});
document.addEventListener("turbolinks:before-render", function () {
  window.Core.destroy();
});
