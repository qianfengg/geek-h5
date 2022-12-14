import styles from "./index.module.scss";
import { NavBar, Toast, Form, Input, List, Button } from "antd-mobile";
import { useHistory, useLocation } from "react-router";
import { LoginForm } from "@/types/data";
import { useDispatch } from "react-redux";
import { login, sendCode } from "@/store/actions/login";
import { useEffect, useRef, useState } from "react";
import { InputRef } from "antd-mobile/es/components/input";

export default function Login() {
  const history = useHistory();
  const location = useLocation<{ redirectURL: string }>();
  const dispatch = useDispatch();
  const mobileRef = useRef<InputRef>(null);
  const [form] = Form.useForm();
  const finishFn = async (values: LoginForm) => {
    // try {
    //   await dispatch(login(values));
    //   Toast.show({
    //     content: "登录成功",
    //     duration: 1000,
    //     afterClose: () => {
    //       history.push("/home");
    //     },
    //   });
    // } catch (e) {
    //   const error = e as AxiosError<ApiResponse>;
    //   console.log("登录出错", error.response?.data.message);
    // }
    await dispatch(login(values));
    Toast.show({
      content: "登录成功",
      duration: 1000,
      afterClose: () => {
        const redirectURL = location?.state?.redirectURL;
        history.push(redirectURL || "/home");
      },
    });
  };
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef<number>();
  const getCode = async () => {
    if (seconds > 0) return;
    const mobileValue = form.getFieldValue("mobile");
    const mobileErrors = form.getFieldError("mobile");
    // console.log({ mobileValue, mobileErrors });
    if (!mobileValue || mobileErrors.length > 0) {
      mobileRef.current?.nativeElement?.focus();
      return;
    }
    await dispatch(sendCode(mobileValue));
    setSeconds(60);
    timerRef.current = window.setInterval(() => {
      setSeconds((s) => s - 1);
    }, 1000);
  };
  // 清理定时器: 每次秒数变化时判断倒计时是否结束
  useEffect(() => {
    if (seconds <= 0) {
      clearInterval(timerRef.current);
    }
  }, [seconds]);

  // 清理定时器: 组件销毁时
  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
    };
  }, []);
  return (
    <div className={styles.root}>
      <NavBar onBack={() => history.go(-1)}></NavBar>

      <div className="login-form">
        <h2 className="title">账号登录</h2>

        <Form onFinish={finishFn} form={form}>
          <Form.Item
            className="login-item"
            name="mobile"
            rules={[
              { required: true, message: "请输入用户名" },
              {
                pattern: /^1[3-9]\d{9}$/,
                message: "请输入正确的手机号",
              },
            ]}
            validateTrigger={["onChange", "onBlur"]}
          >
            <Input placeholder="请输入用户名" ref={mobileRef}></Input>
          </Form.Item>

          <List.Item
            arrow={false}
            clickable={false}
            className="login-code-extra"
            extra={
              <span className="code-extra">
                {seconds === 0 ? "发送验证码" : `${seconds}s后再发送`}
              </span>
            }
            onClick={getCode}
          >
            <Form.Item
              className="login-item"
              name="code"
              rules={[
                {
                  required: true,
                  message: "请输入验证码",
                },
                {
                  pattern: /\d{6}/,
                  message: "验证码格式错误",
                },
              ]}
              validateTrigger={["onChange", "onBlur"]}
            >
              <Input placeholder="请输入验证码"></Input>
            </Form.Item>
          </List.Item>

          <Form.Item>
            <Button
              color="primary"
              className="login-submit"
              block
              type="submit"
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
