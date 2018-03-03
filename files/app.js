"use strict";

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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

    _this4.endpoint = "authors";
    return _this4;
  }

  return Author;
}(Model);

var Face = function (_Model2) {
  _inherits(Face, _Model2);

  function Face() {
    _classCallCheck(this, Face);

    var _this5 = _possibleConstructorReturn(this, (Face.__proto__ || Object.getPrototypeOf(Face)).call(this));

    _this5.endpoint = "faces";
    return _this5;
  }

  return Face;
}(Model);

var Message = function (_Model3) {
  _inherits(Message, _Model3);

  function Message() {
    _classCallCheck(this, Message);

    var _this6 = _possibleConstructorReturn(this, (Message.__proto__ || Object.getPrototypeOf(Message)).call(this));

    _this6.endpoint = "messages";
    return _this6;
  }

  return Message;
}(Model);

var NewsletterEmail = function (_Model4) {
  _inherits(NewsletterEmail, _Model4);

  function NewsletterEmail() {
    _classCallCheck(this, NewsletterEmail);

    var _this7 = _possibleConstructorReturn(this, (NewsletterEmail.__proto__ || Object.getPrototypeOf(NewsletterEmail)).call(this));

    _this7.endpoint = "_newsletter_email";
    return _this7;
  }

  return NewsletterEmail;
}(Model);

var Piece = function (_Model5) {
  _inherits(Piece, _Model5);

  function Piece() {
    _classCallCheck(this, Piece);

    var _this8 = _possibleConstructorReturn(this, (Piece.__proto__ || Object.getPrototypeOf(Piece)).call(this));

    _this8.endpoint = "pieces";
    return _this8;
  }

  return Piece;
}(Model);

var Session = function (_Model6) {
  _inherits(Session, _Model6);

  function Session() {
    _classCallCheck(this, Session);

    var _this9 = _possibleConstructorReturn(this, (Session.__proto__ || Object.getPrototypeOf(Session)).call(this));

    _this9.endpoint = "sessions";
    return _this9;
  }

  _createClass(Session, [{
    key: "save",
    value: function save(data) {
      var _this10 = this;

      return _get(Session.prototype.__proto__ || Object.getPrototypeOf(Session.prototype), "save", this).call(this, data).then(function () {
        Cookies.set("Session-Id", _this10.attributes._id);
        Cookies.set("Session-Secret", _this10.attributes.secret);
        Cookies.set("User-Id", _this10.attributes.user_id);

        return _this10;
      });
    }
  }, {
    key: "destroy",
    value: function destroy() {
      var _this11 = this;

      return _get(Session.prototype.__proto__ || Object.getPrototypeOf(Session.prototype), "destroy", this).call(this).then(function () {
        Cookies.delete("Session-Id");
        Cookies.delete("Session-Secret");
        Cookies.delete("User-Id");
        Cookies.delete("Token-Id");

        Turbolinks.visit(window.location.pathname);

        return _this11;
      });
    }
  }]);

  return Session;
}(Model);

var Overlay = function (_React$Component) {
  _inherits(Overlay, _React$Component);

  function Overlay(props) {
    _classCallCheck(this, Overlay);

    var _this12 = _possibleConstructorReturn(this, (Overlay.__proto__ || Object.getPrototypeOf(Overlay)).call(this, props));

    _this12.noescape = false;
    _this12.togglers = undefined;

    _this12.state = {
      showed: false
    };

    _this12.toggle = _this12.toggle.bind(_this12);
    _this12.hide = _this12.hide.bind(_this12);
    _this12.click = _this12.click.bind(_this12);
    return _this12;
  }

  _createClass(Overlay, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      document.addEventListener("click", this.click);
      if (!this.noescape) {
        key("escape", this.hide);
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      document.removeEventListener("click", this.click);
      if (!this.noescape) {
        key.unbind("escape", this.hide);
      }
    }
  }, {
    key: "toggle",
    value: function toggle(e) {
      if (e) {
        e.preventDefault();
        if (e.currentTarget && e.currentTarget.blur) {
          e.currentTarget.blur();
        }
      }

      this.setState({ showed: !this.state.showed });
    }
  }, {
    key: "hide",
    value: function hide(e) {
      if (this.state.showed) {
        this.setState({ showed: false });
      }
    }
  }, {
    key: "click",
    value: function click(e) {
      if (this.togglers && e.target.hasAttribute(this.togglers)) {
        this.toggle(e);
      }
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { className: "overlay" + (this.state.showed ? " overlay--show" : "") },
        React.createElement("a", { className: "overlay__back", onClick: this.hide.bind(this) }),
        React.createElement(
          "div",
          { className: "overlay__container" },
          this.props.children
        )
      );
    }
  }]);

  return Overlay;
}(React.Component);

var Account = function (_Overlay) {
  _inherits(Account, _Overlay);

  function Account(props) {
    _classCallCheck(this, Account);

    var _this13 = _possibleConstructorReturn(this, (Account.__proto__ || Object.getPrototypeOf(Account)).call(this, props));

    _this13.togglers = "data-toggle-account";


    _this13.state = {
      session: new Session(),
      showed: false
    };

    if (props.session) {
      _this13.state.session.id = props.session._id;
      _this13.state.session.attributes = props.session;

      _this13.fetchUser();
    }

    _this13.login = _this13.login.bind(_this13);
    _this13.logout = _this13.logout.bind(_this13);
    return _this13;
  }

  _createClass(Account, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      _get(Account.prototype.__proto__ || Object.getPrototypeOf(Account.prototype), "componentDidMount", this).call(this);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      _get(Account.prototype.__proto__ || Object.getPrototypeOf(Account.prototype), "componentWillUnmount", this).call(this);
    }
  }, {
    key: "fetchUser",
    value: function fetchUser() {
      var _this14 = this;

      var user = new Face();
      user.id = this.state.session.attributes.user_id;
      user.fetch().then(function (user) {
        _this14.setState({ user: user });
      });

      window.user = user;
    }
  }, {
    key: "login",
    value: function login(e, state) {
      var _this15 = this;

      this.state.session.save(state).then(function (session) {
        _this15.setState({ session: session });
        _this15.fetchUser();
        Turbolinks.visit(window.location.pathname);
      });
    }
  }, {
    key: "logout",
    value: function logout(e) {
      var _this16 = this;

      this.state.session.destroy().then(function (session) {
        _this16.setState({ session: new Session(), user: null });
        Turbolinks.visit(window.location.pathname);
      });
    }
  }, {
    key: "render",
    value: function render() {

      return React.createElement(
        "div",
        { className: "overlay" + (this.state.showed ? " overlay--show" : "") },
        React.createElement(Button, { className: "button--transparent overlay__back", onClick: this.hide }),
        React.createElement(
          "div",
          { className: "padded padded--tight overlay__container" },
          this.state.session.id && this.state.user ? React.createElement(
            "div",
            { className: "text_center" },
            React.createElement(
              "h2",
              null,
              "Hi ",
              this.state.user.attributes.first_name,
              "!"
            ),
            React.createElement(
              "p",
              null,
              React.createElement(
                "a",
                { className: "button", onClick: this.hide, href: "/faces/" + this.state.user.attributes.handle },
                "Head to your profile"
              )
            ),
            React.createElement(Button, { className: "button--transparent", label: "Logout", onClick: this.logout })
          ) : React.createElement(Form, {
            onSubmit: this.login,
            cta: "Log in",
            fields: [{
              type: "email",
              name: "email",
              label: "Email address",
              placeholder: "your.email.address@gmail.com"
            }, {
              type: "password",
              name: "password",
              label: "Password",
              placeholder: "********"
            }] })
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

var Edit = function (_Overlay2) {
  _inherits(Edit, _Overlay2);

  function Edit(props) {
    _classCallCheck(this, Edit);

    var _this17 = _possibleConstructorReturn(this, (Edit.__proto__ || Object.getPrototypeOf(Edit)).call(this, props));

    _this17.togglers = "data-toggle-edit";

    _this17.state = {
      showed: false
    };
    return _this17;
  }

  _createClass(Edit, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      _get(Edit.prototype.__proto__ || Object.getPrototypeOf(Edit.prototype), "componentDidMount", this).call(this);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      _get(Edit.prototype.__proto__ || Object.getPrototypeOf(Edit.prototype), "componentWillUnmount", this).call(this);
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { className: "overlay" + (this.state.showed ? " overlay--show" : "") },
        React.createElement(Button, { className: "button--transparent overlay__back", onClick: this.hide }),
        React.createElement(
          "div",
          { className: "padded padded--tight overlay__container" },
          React.createElement(Form, {
            model: this.props.model,
            modelId: this.props.modelId,
            values: this.props.values,
            fields: this.props.fields,
            cta: "Save" })
        )
      );
    }
  }]);

  return Edit;
}(Overlay);

var Form = function (_React$Component2) {
  _inherits(Form, _React$Component2);

  function Form(props) {
    _classCallCheck(this, Form);

    var _this18 = _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).call(this, props));

    _this18.state = {
      waiting: false,
      success: false,
      errors: undefined
    };

    if (props.model) {
      _this18.state.model = new window[props.model]();
      if (props.modelId) {
        _this18.state.model.id = props.modelId;
      }
    }

    _this18.props.fields.forEach(function (field) {
      if (field.value) {
        _this18.state[field.name] = field.value;
      }
    });

    _this18.onSubmit = _this18.onSubmit.bind(_this18);
    _this18.onChange = _this18.onChange.bind(_this18);
    _this18.hideErrors = _this18.hideErrors.bind(_this18);
    return _this18;
  }

  _createClass(Form, [{
    key: "onSubmit",
    value: function onSubmit(e) {
      var _this19 = this;

      this.setState({
        waiting: true
      });

      if (this.state.model) {
        e.preventDefault();
        this.state.model.save(this.state).then(function (model) {
          if (!model.errors) {
            _this19.setState({
              model: model,
              success: true
            });

            if (_this19.props.redirect) {
              Turbolinks.visit(_this19.props.redirect);
            } else {
              if (model.attributes.route) {
                Turbolinks.visit("" + lang_route + model.endpoint + "/" + model.attributes.route);
              } else if (model.attributes.handle) {
                Turbolinks.visit("" + lang_route + model.endpoint + "/" + model.attributes.handle);
              } else if (_this19.props.model != "session") {
                Turbolinks.visit("" + lang_route + model.endpoint + "/" + model.attributes._id);
              }
            }
          } else {
            _this19.setState({
              errors: model.errors,
              waiting: false
            });
          }
        }).catch(function (error) {
          _this19.setState({
            errors: "There's been a server error, please contact hi@goodfaces.club",
            waiting: false
          });
        });
      }

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
    key: "hideErrors",
    value: function hideErrors(e) {
      this.setState({
        errors: undefined
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this20 = this;

      return [React.createElement(
        "form",
        _defineProperty({ key: "form", className: this.props.className, onSubmit: this.onSubmit, action: this.props.action, method: this.props.method || "POST"
        }, "onSubmit", this.onSubmit),
        this.props.children ? this.props.children : this.props.fields.map(function (field, index) {
          if (field.type == "header") {
            return React.createElement(
              "h3",
              { className: "padded padded--tight flat_bottom text_center", key: index },
              field.body
            );
          } else if (field.type == "info") {
            return React.createElement(
              "p",
              { className: "padded padded--tight flat_bottom text_center", key: index },
              field.body
            );
          } else if (field.type == "link") {
            return React.createElement(
              "p",
              { className: "padded padded--tight flat_bottom text_center", key: index },
              React.createElement(
                "a",
                { href: field.url, target: field.target, className: "underline highlight" },
                field.body ? field.body : field.url
              )
            );
          } else if (field.type == "photos") {
            return React.createElement(Photos, { key: index, name: field.name,
              editable: true,
              onChange: _this20.onChange,
              label: field.label,
              min: field.min || 4,
              photos: _this20.props.values && _this20.props.values[field.name] || field.value || [] });
          } else if (field.type == "tags") {
            return React.createElement(Tags, { key: index, name: field.name,
              editable: true,
              onChange: _this20.onChange,
              tags: field.tags || [],
              selected: _this20.props.values && _this20.props.values[field.name] || field.value || [] });
          } else {
            return React.createElement(Input, { key: index, name: field.name,
              onChange: _this20.onChange,
              type: field.type,
              value: _this20.props.values && _this20.props.values[field.name] || field.value,
              label: field.label,
              options: field.options,
              multiple: field.multiple,
              optional: field.optional,
              placeholder: field.placeholder,
              autoFocus: field.autofocus,
              "new": field.new });
          }
        }),
        React.createElement(Button, { key: "button", label: this.state.waiting ? this.state.success ? "Success!" : "One moment..." : this.props.cta, disabled: this.state.waiting })
      ), this.state.errors && React.createElement(
        Overlay,
        { key: "errors", show: true },
        React.createElement(
          "div",
          { className: "text_center" },
          React.createElement(
            "p",
            { className: "small_bottom" },
            this.state.errors
          ),
          React.createElement(
            Button,
            { tight: true, onClick: this.hideErrors },
            "Okay, thanks"
          )
        )
      )];
    }
  }]);

  return Form;
}(React.Component);

var Gallery = function (_Overlay3) {
  _inherits(Gallery, _Overlay3);

  function Gallery(props) {
    _classCallCheck(this, Gallery);

    var _this21 = _possibleConstructorReturn(this, (Gallery.__proto__ || Object.getPrototypeOf(Gallery)).call(this, props));

    _this21.togglers = "data-toggle-gallery";

    _this21.state = {
      showed: false
    };
    _this21.left = _this21.left.bind(_this21);
    _this21.right = _this21.right.bind(_this21);
    return _this21;
  }

  _createClass(Gallery, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      _get(Gallery.prototype.__proto__ || Object.getPrototypeOf(Gallery.prototype), "componentDidMount", this).call(this);
      this.flkty = new Flickity(this.slider, {
        wrapAround: true,
        prevNextButtons: false,
        pageDots: false,
        adaptiveHeight: false,
        accessibility: false,
        selectedAttraction: 0.01,
        friction: 0.15
      });
      key("left", this.left);
      key("right", this.right);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      _get(Gallery.prototype.__proto__ || Object.getPrototypeOf(Gallery.prototype), "componentWillUnmount", this).call(this);
      this.flkty.destroy();
      key.unbind("left", this.left);
      key.unbind("right", this.right);
    }
  }, {
    key: "toggle",
    value: function toggle(e) {
      this.flkty.select(e.target.getAttribute(this.togglers), false, true);
      _get(Gallery.prototype.__proto__ || Object.getPrototypeOf(Gallery.prototype), "toggle", this).call(this, e);
    }
  }, {
    key: "left",
    value: function left(e) {
      this.flkty.previous();
    }
  }, {
    key: "right",
    value: function right(e) {
      this.flkty.next();
    }
  }, {
    key: "render",
    value: function render() {
      var _this22 = this;

      return React.createElement(
        "div",
        { className: "overlay" + (this.state.showed ? " overlay--show" : "") },
        React.createElement(Button, { className: "button--transparent overlay__back" }),
        React.createElement(
          "div",
          { ref: function ref(element) {
              return _this22.slider = element;
            }, className: "slider" },
          this.props.photos.map(function (photo, index) {
            return React.createElement(
              "div",
              { key: index, className: "slide" },
              React.createElement("img", { src: photo })
            );
          })
        ),
        React.createElement(Button, { className: "button--transparent overlay__close", label: "Close", onClick: this.hide })
      );
    }
  }]);

  return Gallery;
}(Overlay);

var Input = function Input(props) {
  var random = Math.random();
  if (props.type == "hidden") {
    return React.createElement("input", { name: props.name, id: props.name + "_" + random,
      type: props.type,
      defaultValue: props.value });
  } else if (props.type == "readonly") {
    return [props.label && React.createElement(
      "label",
      { key: "label", htmlFor: props.name + "_" + random },
      props.label
    ), React.createElement("input", { key: "input", name: props.name, id: props.name + "_" + random,
      type: "hidden",
      defaultValue: props.value,
      onChange: props.onChange }), React.createElement(
      "p",
      { key: "text", className: "input" },
      props.text
    )];
  } else if (props.type == "textarea") {
    return [props.label && React.createElement(
      "label",
      { key: "label", htmlFor: props.name + "_" + random },
      props.label
    ), React.createElement("textarea", { key: "input", name: props.name, id: props.name + "_" + random,
      defaultValue: props.value,
      placeholder: props.placeholder,
      required: props.required ? true : false,
      onChange: props.onChange })];
  } else if (props.type == "checkbox") {
    return [React.createElement("input", { key: "input", name: props.name, id: props.name + "_" + random + "_" + props.value,
      className: props.pill ? "checkbox--pill" : undefined,
      type: props.type,
      defaultValue: props.value,
      defaultChecked: props.checked,
      required: props.required ? true : false,
      onChange: props.onChange }), props.label && React.createElement(
      "label",
      { key: "label", htmlFor: props.name + "_" + random + "_" + props.value },
      props.label
    )];
  } else if (props.type == "select") {
    return [props.label && React.createElement(
      "label",
      { key: "label", htmlFor: props.name + "_" + random },
      props.label
    ), React.createElement(
      "select",
      { key: "input", name: props.name, id: props.name + "_" + random, defaultValue: props.value ? props.value : props.multiple ? [] : null,
        multiple: props.multiple ? true : false,
        size: props.multiple ? props.options.length : undefined,
        onChange: props.onChange },
      props.optional && React.createElement(
        "option",
        { value: undefined },
        props.placeholder
      ),
      props.options.map(function (option) {
        if (option.value != undefined) {
          return React.createElement(
            "option",
            { key: option.value, value: option.value },
            option.label
          );
        } else {
          return React.createElement(
            "option",
            { key: option, value: option },
            option
          );
        }
      })
    )];
  } else {
    return [props.label && React.createElement(
      "label",
      { key: "label", htmlFor: props.name + "_" + random },
      props.label,
      props.optional ? " (Optional)" : ""
    ), React.createElement("input", { key: "input", name: props.name, id: props.name + "_" + random, className: props.inline ? "input--inline" : undefined,
      type: props.type ? props.type : 'text',
      defaultValue: props.type == "date" && props.value ? props.value.split("T")[0] : props.value,
      placeholder: props.placeholder,
      required: props.optional ? false : true,
      disabled: props.disabled ? true : false,
      autoFocus: props.autoFocus ? true : false,
      autoComplete: props.type == "password" && props.new ? "new-password" : props.type == "search" ? "off" : undefined,
      step: props.type == "number" ? "any" : undefined,
      onChange: props.onChange })];
  }
};

var Photos = function (_React$Component3) {
  _inherits(Photos, _React$Component3);

  function Photos(props) {
    _classCallCheck(this, Photos);

    var _this23 = _possibleConstructorReturn(this, (Photos.__proto__ || Object.getPrototypeOf(Photos)).call(this, props));

    _this23.state = {
      photos: props.photos
    };

    _this23.file = document.createElement("input");
    _this23.file.type = "file";

    _this23.click = _this23.click.bind(_this23);
    _this23.upload = _this23.upload.bind(_this23);
    _this23.remove = _this23.remove.bind(_this23);
    return _this23;
  }

  _createClass(Photos, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.file.addEventListener("change", this.upload);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.file.removeEventListener("change", this.upload);
    }
  }, {
    key: "remove",
    value: function remove(e, index) {
      e.stopPropagation();
      this.setPhotos(this.state.photos.filter(function (photo, i) {
        return i != index;
      }));
    }
  }, {
    key: "click",
    value: function click(e, index) {
      this.file.click();
    }
  }, {
    key: "upload",
    value: function upload(e) {
      var _this24 = this;

      var file = e.currentTarget.files[0];
      if (file && file.type.match('image.*')) {
        Turbolinks.controller.adapter.progressBar.setValue(0);
        Turbolinks.controller.adapter.progressBar.show();

        Upload.upload(file).then(function (response) {
          Turbolinks.controller.adapter.progressBar.setValue(100);
          Turbolinks.controller.adapter.progressBar.hide();

          _this24.setPhotos([].concat(_toConsumableArray(_this24.state.photos), [response.url]));
        });
      }
    }
  }, {
    key: "setPhotos",
    value: function setPhotos(photos) {
      this.props.onChange({ currentTarget: {
          name: this.props.name,
          type: "photos",
          value: photos
        } });

      this.setState({
        photos: photos
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this25 = this;

      return [this.props.label && React.createElement(
        "label",
        { key: "label", htmlFor: this.props.name },
        this.props.label,
        this.props.optional ? " (Optional)" : ""
      ), React.createElement(
        "div",
        { key: "photos", ref: function ref(element) {
            return _this25.container = element;
          }, className: "grid grid--tight_guttered grid--stretch medium_bottom full_images" },
        this.state.photos.map(function (photo, index) {
          return React.createElement(
            "div",
            { key: index, className: "col col--4of12 absolute_container" },
            React.createElement(
              "div",
              { className: "absolute absolute--top_right" },
              React.createElement(Button, { className: "button--small button--grey button--faded", onClick: function onClick(e) {
                  return _this25.remove(e, index);
                }, label: "Remove" })
            ),
            React.createElement("img", { className: "rounded shadowed", src: "https://montrealuploads.imgix.net" + photo + "?auto=format,compress&w=200", "data-photo": photo })
          );
        }),
        React.createElement(
          "div",
          { className: "col col--4of12 grid grid--stretch", "data-no-drag": true },
          React.createElement(Button, { className: "button--dashed", onClick: function onClick(e) {
              return _this25.click(e);
            }, label: "Upload Photo" })
        )
      )];
    }
  }]);

  return Photos;
}(React.Component);

var Tags = function (_React$Component4) {
  _inherits(Tags, _React$Component4);

  function Tags(props) {
    _classCallCheck(this, Tags);

    var _this26 = _possibleConstructorReturn(this, (Tags.__proto__ || Object.getPrototypeOf(Tags)).call(this, props));

    _this26.state = {
      selected: props.selected ? props.selected.reduce(function (tags, tag) {
        tags[tag] = true;return tags;
      }, {}) : {}
    };

    _this26.onChange = _this26.onChange.bind(_this26);
    return _this26;
  }

  _createClass(Tags, [{
    key: "onChange",
    value: function onChange(e) {
      var _this27 = this;

      this.state.selected[e.currentTarget.name.split(":")[1]] = e.currentTarget.checked;

      this.props.onChange({ currentTarget: {
          name: this.props.name,
          type: "tags",
          value: Object.keys(this.state.selected).filter(function (key) {
            return _this27.state.selected[key];
          }).map(function (key) {
            return key;
          })
        } });

      this.setState({
        selected: this.state.selected
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this28 = this;

      var renderTags = function renderTags(type) {
        return React.createElement(
          "div",
          { className: "tags" },
          _this28.props.tags.filter(function (tag) {
            return tag.type === type;
          }).map(function (tag, index) {
            return React.createElement(
              "span",
              { key: index, className: "tag" },
              React.createElement(Input, { onChange: _this28.onChange, type: "checkbox",
                name: _this28.props.name + ":" + tag.key,
                label: tag.title,
                checked: _this28.state.selected[tag.key] ? true : false })
            );
          })
        );
      };

      return React.createElement(
        "div",
        { className: "normal_bottom" },
        React.createElement(
          "label",
          null,
          "Gender (Optional)"
        ),
        renderTags("gender"),
        React.createElement(
          "label",
          null,
          "Ethnicity (Optional)"
        ),
        renderTags("ethnicity"),
        React.createElement(
          "label",
          null,
          "Particularities (Optional)"
        ),
        renderTags("things"),
        React.createElement(
          "label",
          null,
          "Style (Optional)"
        ),
        renderTags("style")
      );
    }
  }]);

  return Tags;
}(React.Component);

var Timer = function (_React$Component5) {
  _inherits(Timer, _React$Component5);

  function Timer(props) {
    _classCallCheck(this, Timer);

    var _this29 = _possibleConstructorReturn(this, (Timer.__proto__ || Object.getPrototypeOf(Timer)).call(this, props));

    _this29.now = new Date();
    _this29.then = _this29.props.until;

    _this29.state = {
      until: _this29.then - _this29.now
    };
    return _this29;
  }

  _createClass(Timer, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this30 = this;

      setInterval(function () {
        _this30.now = new Date();

        _this30.setState({
          until: _this30.then - _this30.now
        });
      }, 1000);
    }
  }, {
    key: "render",
    value: function render() {
      var delta = this.state.until / 1000;
      var days = Math.floor(delta / 86400);
      delta -= days * 86400;

      var hours = Math.floor(delta / 3600) % 24;
      delta -= hours * 3600;

      var minutes = Math.floor(delta / 60) % 60;
      delta -= minutes * 60;

      var seconds = Math.floor(delta % 60);

      return React.createElement(
        React.Fragment,
        null,
        days,
        " days ",
        hours,
        " hours ",
        minutes,
        " minutes ",
        seconds,
        " seconds"
      );
    }
  }]);

  return Timer;
}(React.Component);

window.Core = {
  init: function init() {
    console.log('c:c:');
    this.render();
  },
  render: function render() {
    var element = null;
    for (var i = window.components.length - 1; i >= 0; i--) {
      element = document.querySelectorAll(window.components[i].element)[0];
      element.setAttribute("data-component", window.components[i].component);

      ReactDOM.render(React.createElement(window[window.components[i].component], window.components[i].data), element);
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
