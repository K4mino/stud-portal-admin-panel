import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Button, Form, Input,Table } from 'antd'
import Layout from '../Layout';
import {  collection, deleteDoc, doc,getDocs,onSnapshot,setDoc } from 'firebase/firestore';
import { app, auth, db } from '../../firebase';
import { createUserWithEmailAndPassword, deleteUser,signInWithEmailAndPassword} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Wrapper = styled.div`
  padding:20px;
  display:flex;
  flex-direction:column;
  width:100%;
`;

const StyledForm = styled(Form)`
  display:flex;
`;

const Delete = styled(Button)`
  background-color:red;
  color:#fff;
  border:1px solid red;

  &:hover {
    color:red;
    background-color:#fff;
    border:1px solid red;
  }
`;

const Update = styled(Button)`
  background-color:green;
  color:#fff;
  border:1px solid green;

  &:hover {
    color:red;
    background-color:#fff;
    border:1px solid green;
  }
`;


const Main = () => {
  const [form] = Form.useForm();
  const [users,setUsers] = useState([]);
  const navigate = useNavigate();

  const columns = [
    {
      title:'Uid',
      dataIndex:'uid',
      key:'uid'
    },
    {
      title:'Email',
      dataIndex:'email',
      key:'email'
    },
    {
      title:'Action',
      key:'action',
      render:(_,record) => (
        <>
        <Delete onClick={() =>handleDeleteUser(record.uid)}>
          Delete
        </Delete>
        <Update onClick={() => handleUpdateUser(record.uid)}>
          Update 
        </Update>
        </>
      )
    }
  ]

  useEffect(()=> {
    const unsub = onSnapshot(collection(db,'users'),(snapShot) => {
      let list = []
      snapShot.docs.forEach((doc) => {
        list.push(doc.data())
      })
      let filteredList = list.filter((item) => item.role === 'student')
      setUsers(filteredList);
    })

    return () => {
      unsub();
    }
  },[])

  function handleUpdateUser(uid){
    navigate('/main/update/' + uid)
  }

  const handleCreateUser = async() => {
    const {email,password} = form.getFieldsValue()
    
    try {
      const res = await createUserWithEmailAndPassword(auth,email,password);
      await signInWithEmailAndPassword(auth,email,password);
      try {
        await setDoc(doc(db,'users',res.user.uid),{
          uid:res.user.uid,
          email,
          lessons:[],
          password,
          role:'student'
        });
        await setDoc(doc(db,'userChats',res.user.uid),{
        });

        form.setFieldsValue({
          email:'',
          password:''
        })
      } catch (error) {
        console.log(error)
      }
    } catch (error) {
      console.log(error)
    }

  }

  async function handleDeleteUser (uid){
    const user = auth.currentUser
    try {
      await deleteUser(user)
      await deleteDoc(doc(db,'users',uid))
    } catch (error) {
      console.log(error)
    } 
  }

  return (
    <Layout>
        <Wrapper>
          <StyledForm
            form={form}
            name="basic"
            initialValues={{ remember: true }}
            onFinish={handleCreateUser}
            autoComplete="off"
            >
            <Form.Item
            label="Email"
            name="email"
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
          <Table columns={columns} dataSource={users}/>
        </Wrapper>
    </Layout>
  )
}

export default Main