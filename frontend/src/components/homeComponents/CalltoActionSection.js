import React from "react";

const CalltoActionSection = () => {
  return (
    <div className="subscribe-section bg-with-black">
      <div className="container">
        <div className="row">
          <div className="col-xs-12">
            <div className="subscribe-head">
              <h2>Thêm gợi ý không bạn ?</h2>
              <p>Đăng nhập miễn phí ...</p>
              <form className="form-section">
                <input placeholder="Email của bạn..." name="email" type="email" />
                <input value="GIÚP TÔI" name="subscribe" type="submit" />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalltoActionSection;
