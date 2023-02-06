export interface SignUpProps {
  name: string;
  email: string;
  password: string;

  profilePic: string;
}

export interface UserProps {
  email: string;
  id: string;
  name: string;
  profilePicPath: string;
  uid;
}
