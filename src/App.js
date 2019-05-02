import React, { PureComponent } from "react";
import "./App.css";
const token =
  "eyJhbGciOiJSUzI1NiJ9.eyJ1c2VyX2lkIjoxMSwicm9sZV9pZCI6MSwianRpIjoiODE2Y2I1NzItM2JlNS00ODVmLThjMmEtOTk0ZTIwYWNhNzkxIn0.ROdYLQ7Uw8xHTuuU-ICjuKv0v68Byx-8EFbBj3UallcMUmBdaRtuTw1s-L4aANUkP92NQo6EQWos90q7qa_iu0wcwRIpb21RO1aadezczNGGPZTlHIOIM3RLJU5xRIa-gRHUSk-z4AHA8ds7haKrveRTqyzwNnHrLpwit37EcggF3z_FUqeJokRRaRupNrHgUFLi7CBwHKVxg6K5wmAS39EUAu_MjWZ6pFGp9OuOSZkfCiFGkyQqq2fpCyfnWAQn6YjfT9AEHWOrJzoMaqpExY461wgPBh10MN5ICpx_x_UizDbmiXTBHQAhtbpHuzv0GGOCeBlUgHk5rxL-FX_CoQ";

class UserCard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      userData: {}
    };
    this.getUserData = this.getUserData.bind(this);
    this.post = this.post.bind(this);
    this.follow = this.follow.bind(this);
    this.unfollow = this.unfollow.bind(this);
  }

  post() {
    const body = {
      user: {
        ...this.state.userData
      }
    };
    global
      .fetch("http://user.playstg.net/users/6", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      })
      .then(results => {
        return results.json();
      })
      .then(data => {
        this.setState({ userData: data.user });
      });
  }

  follow() {
    // follow is still giving errors
    const { userData } = this.state;
    const body = {
      follower: {
        follower_ids: ["2"]
      }
    };
    global
      .fetch(`http://user.playstg.net/users/${userData.id}/followers`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      })
      .then(results => {
        return results.json();
      })
      .then(data => {
        if (data.length > 0 || data.success === true) {
          global
            .fetch("http://user.playstg.net/users/6", { method: "GET" })
            .then(results => {
              return results.json();
            })
            .then(data => {
              this.setState({ userData: data.user });
            });
        }
      });
  }

  unfollow() {
    const { userData } = this.state;
    global
      .fetch(
        `http://user.playstg.net/users/${userData.id}/unfollow?ids=${
          this.state.userData.id
        }`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      )
      .then(results => {
        return results.json();
      })
      .then(data => {
        if (data.success === true) {
          global
            .fetch("http://user.playstg.net/users/6", { method: "GET" })
            .then(results => {
              return results.json();
            })
            .then(data => {
              this.setState({ userData: data.user });
            });
        }
      });
  }

  componentDidMount() {
    this.getUserData();
  }

  getUserData() {
    const body = {
      user: {
        screen_name: "Teralad",
        first_name: "Varun",
        last_name: "ISLAND",
        birth_date: "1994-07-29",
        short_bio: "Interested in playing badminton and love to swim.",
        location: ["IN"],
        profile_picture:
          "https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
      },
      id: "2"
    };
    global
      .fetch("http://user.playstg.net/users/6", {
        method: "GET",
        // patch is giving 404 error when used with POST that is using GET
        // headers: {
        //   Accept: "application/json",
        //   "Content-Type": "application/json",
        //   Authorization: `Bearer ${token}`,
        //   _method: "PATCH"
        // },
        //body: JSON.stringify(body)
      })
      .then(results => {
        return results.json();
      })
      .then(data => {
        this.setState({ userData: data.user });
      });
  }

  render() {
    const { userData } = this.state;
    const isFollowing =
      userData.following &&
      userData.following.forEach(following => following.id === 2);

    return (
      <div class="container">
        <div className="row ">
          <div className="col col-lg-2">
            <img
              class="card-img-top"
              src={userData.profile_picture}
              alt="Card image cap"
            />
          </div>
          <div className="card-body col col-lg-2">
            <p class="card-text">{userData.first_name}</p>
            <p class="card-text">{userData.last_name}</p>
            <p class="card-text">{userData.email}</p>
            <button onClick={isFollowing ? this.unfollow : this.follow}>
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default UserCard;
