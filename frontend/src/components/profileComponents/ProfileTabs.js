import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Message from "../LoadingError/Error";
import Toast from "./../LoadingError/Toast";
import Loading from "./../LoadingError/Loading";
import { updateUserProfile } from "../../Redux/Actions/userActions";

const ProfileTabs = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const toastId = React.useRef(null);

  const Toastobjects = {
    pauseOnFocusLoss: false,
    draggable: false,
    pauseOnHover: false,
    autoClose: 2000,
  };
  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { loading: updateLoading } = userUpdateProfile;
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [dispatch, user]);

  const submitHandler = (e) => {
    e.preventDefault();

    //Password Match

    if (password !== confirmPassword) {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.error("Hai Mật Khẩu không khớp");
      }
    } else {
      dispatch(updateUserProfile({ id: user._id, name, email, password }));
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.success("Cập Nhật Thành Công", Toastobjects);
      }
    }
  };
  return (
    <>
      <Toast />
      {error && <Message variant="alert-danger">{error}</Message>}
      {loading && <Loading />}
      {updateLoading && <Loading />}
      <form className="row  form-container" onSubmit={submitHandler}>
        <div className="col-md-6">
          <div className="form">
            <label for="account-fn">Tên</label>
            <input
              className="form-control"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        <div className="col-md-6">
          <div className="form">
            <label for="account-email">Địa chỉ Email</label>
            <input
              className="form-control"
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form">
            <label for="account-pass">Mật khẩu mới</label>
            <input
              className="form-control"
              type="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form">
            <label for="account-confirm-pass">Xác nhận lại mật khẩu</label>
            <input
              className="form-control"
              type="password"
              value={confirmPassword}
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>
        <button type="submit">Cập Nhật</button>
      </form>
    </>
  );
};

export default ProfileTabs;
