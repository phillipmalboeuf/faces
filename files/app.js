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

var Piece = function (_Model3) {
  _inherits(Piece, _Model3);

  function Piece() {
    _classCallCheck(this, Piece);

    var _this6 = _possibleConstructorReturn(this, (Piece.__proto__ || Object.getPrototypeOf(Piece)).call(this));

    _this6.endpoint = "pieces";
    return _this6;
  }

  return Piece;
}(Model);

var Session = function (_Model4) {
  _inherits(Session, _Model4);

  function Session() {
    _classCallCheck(this, Session);

    var _this7 = _possibleConstructorReturn(this, (Session.__proto__ || Object.getPrototypeOf(Session)).call(this));

    _this7.endpoint = "sessions";
    return _this7;
  }

  _createClass(Session, [{
    key: "save",
    value: function save(data) {
      var _this8 = this;

      return _get(Session.prototype.__proto__ || Object.getPrototypeOf(Session.prototype), "save", this).call(this, data).then(function () {
        Cookies.set("Session-Id", _this8.attributes._id);
        Cookies.set("Session-Secret", _this8.attributes.secret);
        Cookies.set("User-Id", _this8.attributes.user_id);

        return _this8;
      });
    }
  }, {
    key: "destroy",
    value: function destroy() {
      var _this9 = this;

      return _get(Session.prototype.__proto__ || Object.getPrototypeOf(Session.prototype), "destroy", this).call(this).then(function () {
        Cookies.delete("Session-Id");
        Cookies.delete("Session-Secret");
        Cookies.delete("User-Id");
        Cookies.delete("Token-Id");

        Turbolinks.visit(window.location.pathname);

        return _this9;
      });
    }
  }]);

  return Session;
}(Model);

var Overlay = function (_React$Component) {
  _inherits(Overlay, _React$Component);

  function Overlay(props) {
    _classCallCheck(this, Overlay);

    var _this10 = _possibleConstructorReturn(this, (Overlay.__proto__ || Object.getPrototypeOf(Overlay)).call(this, props));

    _this10.noscroll = true;
    _this10.noescape = false;
    _this10.togglers = undefined;

    _this10.state = {
      showed: false
    };

    _this10.toggle = _this10.toggle.bind(_this10);
    _this10.hide = _this10.hide.bind(_this10);
    _this10.click = _this10.click.bind(_this10);
    return _this10;
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
  }, {
    key: "click",
    value: function click(e) {
      if (this.togglers && e.target.hasAttribute(this.togglers)) {
        e.preventDefault();
        this.toggle();
      }
    }
  }]);

  return Overlay;
}(React.Component);

var Account = function (_Overlay) {
  _inherits(Account, _Overlay);

  function Account(props) {
    _classCallCheck(this, Account);

    var _this11 = _possibleConstructorReturn(this, (Account.__proto__ || Object.getPrototypeOf(Account)).call(this, props));

    _this11.noescape = true;
    _this11.togglers = "data-toggle-account";


    _this11.state = {
      session: new Session(),
      showed: false
    };

    if (props.session) {
      _this11.state.session.id = props.session._id;
      _this11.state.session.attributes = props.session;

      _this11.fetchUser();
    }

    _this11.login = _this11.login.bind(_this11);
    _this11.logout = _this11.logout.bind(_this11);
    return _this11;
  }

  _createClass(Account, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      _get(Account.prototype.__proto__ || Object.getPrototypeOf(Account.prototype), "componentDidMount", this).call(this);
      key("escape", this.toggle);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      _get(Account.prototype.__proto__ || Object.getPrototypeOf(Account.prototype), "componentWillUnmount", this).call(this);
      key.unbind("escape", this.toggle);
    }
  }, {
    key: "fetchUser",
    value: function fetchUser() {
      var _this12 = this;

      var user = new Face();
      user.id = this.state.session.attributes.user_id;
      user.fetch().then(function (user) {
        _this12.setState({ user: user });
      });

      window.user = user;
    }
  }, {
    key: "login",
    value: function login(e, state) {
      var _this13 = this;

      this.state.session.save(state).then(function (session) {
        _this13.setState({ session: session });
        _this13.fetchUser();
        Turbolinks.visit(window.location.pathname);
      });
    }
  }, {
    key: "logout",
    value: function logout(e) {
      var _this14 = this;

      this.state.session.destroy().then(function (session) {
        _this14.setState({ session: new Session(), user: null });
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
          this.state.session.id && React.createElement(
            "div",
            { className: "text_center" },
            this.state.user && React.createElement(
              "div",
              { className: "normal_bottom" },
              React.createElement(
                "h2",
                null,
                "Hi ",
                this.state.user.attributes.first_name,
                "!"
              ),
              React.createElement(
                "a",
                { className: "button", onClick: this.hide, href: "/faces/" + this.state.user.attributes.handle },
                "Head to your profile"
              )
            ),
            React.createElement(Button, { className: "button--transparent", label: "Logout", onClick: this.logout })
          ) || React.createElement(Form, { className: "col col--14of20 col--tablet_portrait--16of20 col--phone--18of20",
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

var Form = function (_React$Component2) {
  _inherits(Form, _React$Component2);

  function Form(props) {
    _classCallCheck(this, Form);

    var _this15 = _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).call(this, props));

    _this15.state = {
      waiting: false,
      success: false,
      errors: undefined
    };

    if (props.model) {
      _this15.state.model = new window[props.model]();
      if (props.modelId) {
        _this15.state.model.id = props.modelId;
      }
    }

    _this15.onSubmit = _this15.onSubmit.bind(_this15);
    _this15.onChange = _this15.onChange.bind(_this15);
    _this15.hideErrors = _this15.hideErrors.bind(_this15);
    return _this15;
  }

  _createClass(Form, [{
    key: "onSubmit",
    value: function onSubmit(e) {
      var _this16 = this;

      this.setState({
        waiting: true
      });

      if (this.state.model) {
        e.preventDefault();
        this.state.model.save(this.state).then(function (model) {
          if (!model.errors) {
            _this16.setState({
              model: model,
              success: true
            });

            if (_this16.props.redirect) {
              Turbolinks.visit(_this16.props.redirect);
            } else {
              if (model.attributes.route) {
                Turbolinks.visit("" + lang_route + model.endpoint + "/" + model.attributes.route);
              } else if (_this16.props.model != "session") {
                Turbolinks.visit("" + lang_route + model.endpoint + "/" + model.attributes._id);
              }
            }
          } else {
            _this16.setState({
              errors: model.errors,
              waiting: false
            });
          }
        }).catch(function (error) {
          _this16.setState({
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
      var _this17 = this;

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
              onChange: _this17.onChange,
              min: field.min || 6,
              photos: _this17.props.values && _this17.props.values[field.name] || field.value || [] });
          } else if (field.type == "tags") {
            return React.createElement(Tags, { key: index, name: field.name,
              editable: true,
              onChange: _this17.onChange,
              tags: field.tags || [],
              selected: _this17.props.values && _this17.props.values[field.name] || field.value || [] });
          } else {
            return React.createElement(Input, { key: index, name: field.name,
              onChange: _this17.onChange,
              type: field.type,
              value: _this17.props.values && _this17.props.values[field.name] || field.value,
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

var Input = function Input(props) {

  if (props.type == "hidden") {
    return React.createElement("input", { name: props.name, id: props.name,
      type: props.type,
      defaultValue: props.value,
      onChange: props.onChange });
  } else if (props.type == "readonly") {
    return [props.label && React.createElement(
      "label",
      { key: "label", htmlFor: props.name },
      props.label
    ), React.createElement("input", { key: "input", name: props.name, id: props.name,
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
      { key: "label", htmlFor: props.name },
      props.label
    ), React.createElement("textarea", { key: "input", name: props.name, id: "" + props.name,
      defaultValue: props.value,
      placeholder: props.placeholder,
      required: props.required ? true : false,
      onChange: props.onChange })];
  } else if (props.type == "checkbox") {
    return [React.createElement("input", { key: "input", name: props.name, id: props.name + "_" + props.value,
      className: props.pill ? "checkbox--pill" : null,
      type: props.type,
      defaultValue: props.value,
      defaultChecked: props.checked,
      required: props.required ? true : false,
      onChange: props.onChange }), props.label && React.createElement(
      "label",
      { key: "label", htmlFor: props.name + "_" + props.value },
      props.label
    )];
  } else if (props.type == "select") {
    return [props.label && React.createElement(
      "label",
      { key: "label", htmlFor: props.name },
      props.label
    ), React.createElement(
      "select",
      { key: "input", name: props.name, id: props.name, defaultValue: props.value ? props.value : props.multiple ? [] : null,
        multiple: props.multiple ? true : false,
        size: props.multiple ? props.options.length : null,
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
      { key: "label", htmlFor: props.name },
      props.label,
      props.optional ? " (Optional)" : ""
    ), React.createElement("input", { key: "input", name: props.name, id: props.name, className: "" + (props.inline ? " input--inline" : null),
      type: props.type ? props.type : 'text',
      defaultValue: props.type == "date" && props.value ? props.value.split("T")[0] : props.value,
      placeholder: props.placeholder,
      required: props.optional ? false : true,
      disabled: props.disabled ? true : false,
      autoFocus: props.autoFocus ? true : false,
      autoComplete: props.type == "password" && props.new ? "new-password" : props.type == "search" ? "off" : null,
      step: props.type == "number" ? "any" : null,
      onChange: props.onChange })];
  }
};

var Photos = function (_React$Component3) {
  _inherits(Photos, _React$Component3);

  function Photos(props) {
    _classCallCheck(this, Photos);

    var _this18 = _possibleConstructorReturn(this, (Photos.__proto__ || Object.getPrototypeOf(Photos)).call(this, props));

    _this18.state = {
      photos: props.photos.length >= props.min ? props.photos : [].concat(_toConsumableArray(props.photos), _toConsumableArray(Array(props.min - props.photos.length).fill().map(function (_, i) {
        return "/faces/empty.png";
      })))
    };
    return _this18;
  }

  _createClass(Photos, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { className: "grid grid--guttered full_images" },
        this.state.photos.map(function (photo, index) {
          return React.createElement(
            "div",
            { key: index, className: "col col--4of12" },
            React.createElement("img", { className: "rounded shadowed", src: "https://montrealuploads.imgix.net" + photo + "?auto=format,compress" })
          );
        })
      );
    }
  }]);

  return Photos;
}(React.Component);

var Tags = function (_React$Component4) {
  _inherits(Tags, _React$Component4);

  function Tags(props) {
    _classCallCheck(this, Tags);

    var _this19 = _possibleConstructorReturn(this, (Tags.__proto__ || Object.getPrototypeOf(Tags)).call(this, props));

    _this19.state = {
      selected: props.selected
    };
    return _this19;
  }

  _createClass(Tags, [{
    key: "render",
    value: function render() {
      var _this20 = this;

      return [React.createElement(
        "div",
        { className: "normal_bottom", key: "gender" },
        React.createElement(
          "label",
          null,
          "Gender (Optional)"
        ),
        React.createElement(
          "div",
          { className: "tags" },
          this.props.tags.filter(function (tag) {
            return tag.type === "gender";
          }).map(function (tag, index) {
            return React.createElement(
              "span",
              { key: index, className: "tag" },
              React.createElement(Input, { type: "checkbox", name: _this20.props.name + ":" + tag.key, label: tag.title })
            );
          })
        ),
        React.createElement(
          "label",
          null,
          "Ethnicity (Optional)"
        ),
        React.createElement(
          "div",
          { className: "tags" },
          this.props.tags.filter(function (tag) {
            return tag.type === "ethnicity";
          }).map(function (tag, index) {
            return React.createElement(
              "span",
              { key: index, className: "tag" },
              React.createElement(Input, { type: "checkbox", name: _this20.props.name + ":" + tag.key, label: tag.title })
            );
          })
        ),
        React.createElement(
          "label",
          null,
          "Hair type (Optional)"
        ),
        React.createElement(
          "div",
          { className: "tags" },
          this.props.tags.filter(function (tag) {
            return tag.type === "hair";
          }).map(function (tag, index) {
            return React.createElement(
              "span",
              { key: index, className: "tag" },
              React.createElement(Input, { type: "checkbox", name: _this20.props.name + ":" + tag.key, label: tag.title })
            );
          })
        ),
        React.createElement(
          "label",
          null,
          "Body type (Optional)"
        ),
        React.createElement(
          "div",
          { className: "tags" },
          this.props.tags.filter(function (tag) {
            return tag.type === "body";
          }).map(function (tag, index) {
            return React.createElement(
              "span",
              { key: index, className: "tag" },
              React.createElement(Input, { type: "checkbox", name: _this20.props.name + ":" + tag.key, label: tag.title })
            );
          })
        ),
        React.createElement(
          "label",
          null,
          "Style (Optional)"
        ),
        React.createElement(
          "div",
          { className: "tags" },
          this.props.tags.filter(function (tag) {
            return tag.type === "style";
          }).map(function (tag, index) {
            return React.createElement(
              "span",
              { key: index, className: "tag" },
              React.createElement(Input, { type: "checkbox", name: _this20.props.name + ":" + tag.key, label: tag.title })
            );
          })
        )
      )];
    }
  }]);

  return Tags;
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
