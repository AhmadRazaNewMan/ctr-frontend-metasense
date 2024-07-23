import React, { Fragment, useState, useEffect } from "react";
import { Button, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

//Components
import { adminLogin } from "../../redux/methods/authMethods";

export default function Login() {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  const dispatch = useDispatch();
  const { loading, success, errors } = useSelector(
    (state) => state.adminLoginReducer
  );
  const [form] = Form.useForm();
  const navigate = useNavigate();

  //Displaying errors
  useEffect(() => {
    if (errors.length > 0) {
      errors.map((err) => toast.error(err.message));
    }
  }, [errors]);

  //Display Success
  useEffect(() => {
    if (success) {
      toast.success("Login Successfully");
      setEmail(null);
      setPassword(null);
      navigate("/dashboard");
    }
  }, [success, navigate]);

  //Functions
  const handleLogin = (e) => {
    dispatch(adminLogin(email, password));
  };

  return (
    <Fragment>
      <h1 className="text-xl font-bold font-poppins leading-tight text-black md:text-2xl text-left tracking-wide">
        Admin Login
      </h1>
      <Form
        className="space-y-4 md:space-y-6"
        form={form}
        name="login"
        onFinish={handleLogin}
        layout={"vertical"}
        requiredMark={false}
      >
        <div>
          <Form.Item
            name="email"
            label={
              <p className="block text-sm font-medium font-poppins text-gray-900">
                Email
              </p>
            }
            rules={[
              {
                required: true,
                message: "Please enter your email",
              },
              {
                type: "email",
                message: "Invalid email address",
              },
            ]}
          >
            <Input
              placeholder="name@example.com"
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-50 font-lato text-gray-900 sm:text-sm py-1.5"
            />
          </Form.Item>
        </div>
        <div>
          <Form.Item
            name="password"
            label={
              <p className="block text-sm font-medium font-poppins text-gray-900">
                Password
              </p>
            }
            rules={[
              {
                required: true,
                message: "Please enter your password",
              },
            ]}
          >
            <Input.Password
              placeholder="••••••••"
              visibilityToggle={false}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-50 font-lato text-gray-900 sm:text-sm py-1.5"
            />
          </Form.Item>
        </div>

        <div className="text-center">
          <Button
            className="mt-4 bg-primary"
            block
            loading={loading}
            type="primary"
            size="large"
            htmlType={"submit"}
          >
            Login
          </Button>
        </div>
      </Form>
    </Fragment>
  );
}
