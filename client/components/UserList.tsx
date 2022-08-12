import React, { FC } from "react";

type Props<T> = {
  users: T[];
  render: (user: T) => React.ReactNode;
};

// Constrain the re-usable component to only accept a generic which has a string key, and
// string | boolean | number values/

// This extends only works in generic components like this. Trying to add extends to a
// non generic component doesn't make sense as the component will already be typed to match
// the data going in to it. Adding "extends" to types in a normal component will actually
// make it more difficult as from the components POV it's opening up MORE types that need to
// be accounted for in the code
const UserList = <T extends Record<string, string | boolean | number>>({
  users,
  render,
}: Props<T>) => {
  return (
    <div>
      {users?.length ? (
        users.map((user) => {
          return render(user);
        })
      ) : (
        <p>There are no registered users.</p>
      )}
    </div>
  );
};

export default UserList;
