import React, { FC } from "react";
import withAuthentication from "../../services/with-authentication";
import axios from "axios";
import UserList from "../../components/UserList";

// Probably wouldn't be done this this IRL, but this adds a "position" object value
// to the AllUsers list. Note that this DOESN'T get added until actually within the
// component, and therefore is not needed in the Props type, as that only types the
// values coming from the server in getServerSideProps(). The OPTIONAL generic type
// is passed to AllUsers component & through the type declaration, and added to the
// end of the type. The inside of the UserList component does not know about the
// generic type being added, as it's all being passed back up to the render prop,
// so we've kept the UserList component separate and only worrying about the UI and
// implementation, not the data inside.

// https://mariusschulz.com/blog/passing-generics-to-jsx-elements-in-typescript

type IListNumber = {
  position: number;
};

type User = {
  email: string;
  isThisUser: boolean;
};

type AllUsers<T = {}> = Omit<User, "isThisUser"> & T;

type Props = {
  users: AllUsers[];
  thisUser: User[];
};

const Users: FC<Props> = ({ thisUser, users }) => {
  return (
    <>
      <h2>Dashboard</h2>
      <div className="mb-10">
        <p>Users:</p>
        <UserList<AllUsers<IListNumber>>
          users={users.map((u, i) => ({ ...u, position: i + 1 }))}
          render={(user) => {
            return (
              <div>
                <span>{user.position}</span>
                {user.email}
              </div>
            );
          }}
        ></UserList>
      </div>

      <div className="mb-10">
        <p>Current user:</p>
        <UserList<User>
          users={thisUser}
          render={(user: User) => {
            return <div>{user.email}</div>;
          }}
        ></UserList>
      </div>
    </>
  );
};

export const getServerSideProps = withAuthentication(
  async (context, props, jwt): Promise<{ props: Props }> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_NETWORK_API_URL}/users`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      return {
        props: {
          thisUser: response.data.users
            .filter((user) => user.id === props.id)
            .map((user) => {
              return {
                ...user,
                isThisUser: true,
              };
            }),
          users: response.data.users,
        },
      };
    } catch (e) {
      return {
        props: {
          users: [],
          thisUser: [],
        },
      };
    }
  }
);

export default Users;
