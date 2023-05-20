import React, { useContext } from 'react'
import { Button, Form, Input } from 'antd'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Wrapper = styled.div`
    width:100vw;
    height:100vh;
    display:flex;
    justify-content:center;
    align-items:center;
`;

const StyledForm = styled(Form)`
    width:600px;
    padding:20px;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.15);
    border-radius:24px;
`;

const FormPage = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const {dispatch} = useContext(AuthContext);

    const handleLogin =() => {
        const {username,password} = form.getFieldsValue()
        let user = {
          username,
          password
        }
        dispatch({type:'LOGIN',payload:user})
        if(username === 'admin' && password === 'Qwerty1234$'){
            navigate('/main')
        }else {
            alert('error')
        }
    }

  return (
<Wrapper>
    <StyledForm
    form={form}
    name="basic"
    initialValues={{ remember: true }}
    onFinish={handleLogin}
    autoComplete="off"
  >
    <Form.Item
      label="Username"
      name="username"
      rules={[{ required: true, message: 'Please input your username!' }]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Password"
      name="password"
      rules={[{ required: true, message: 'Please input your password!' }]}
    >
      <Input.Password />
    </Form.Item>

    <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form.Item>
  </StyledForm>
  </Wrapper>
  )
}

export default FormPage