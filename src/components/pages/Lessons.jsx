import React, { useState } from 'react'
import { useEffect } from 'react'
import { onSnapshot,collection, setDoc, doc } from 'firebase/firestore'
import { Table,Button,Form,DatePicker,Input } from 'antd'
import styled from 'styled-components'
import dayjs from 'dayjs'
import { db } from '../../firebase'
import Layout from '../Layout'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid';

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

const Lessons = () => {
    const [lessons,setLessons] = useState([])
    const navigate = useNavigate()
    const [form] = Form.useForm()

    const columns = [
        {
          title:'Uid',
          dataIndex:'uid',
          key:'uid'
        },
        {
          title:'Name',
          dataIndex:'name',
          key:'name'
        },
        {
          title:'Start time',
          dataIndex:'start',
          key:'start',
          render:(record) => dayjs(record.toDate()).locale('en').format('YYYY-MM-DD HH:mm:ss')
        },
        {
          title:'End time',
          dataIndex:'end',
          key:'end',
          render:(record) => dayjs(record.toDate()).locale('en').format('YYYY-MM-DD HH:mm:ss')
        },
        {
            title:'Teacher',
            dataIndex:'teacher',
            key:'teacher'
        },
        {
          title:'Cabinet',
          dataIndex:'cabinet',
          key:'cabinet'
        },
        {
          title:'Action',
          key:'action',
          render:(_,record) => (
            <>
                <Update onClick={() => navigate(`/lessons/update/${record.uid}`)}>Update</Update>
            </>
          )
        }
      ]

    useEffect(() => {
        const unsub = onSnapshot(collection(db,'lessons'),(snapShot) => {
            let list = []
            snapShot.docs.forEach((doc) => {
                list.push(doc.data())
            })
            setLessons(list)
          })
      
          return () => {
            unsub();
          }
    },[]);


    const handleAddLesson = async() => {
        const {lessonName,cabinet,title,teacher,startTime,endTime} = form.getFieldsValue()
        let id = uuidv4();
        try {
            await setDoc(doc(db,'lessons',id),{
                uid:id,
                name:lessonName,
                cabinet,
                title,
                teacher,
                start:startTime.$d,
                end:endTime.$d,
                date:startTime.$d,
                tasks:[]
              });
            form.setFieldsValue({
                lessonName:'',
                cabinet:'',
                title:'',
                teacher:'',
                startTime:'',
                endTime:''
            })
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <Layout>
        <Form
        style={{paddingTop:'20px'}}
        onFinish={handleAddLesson}
        form={form}>
            <Form.Item
                label='Lesson-Name:'
                name='lessonName'>
                <Input/>
            </Form.Item>
            <Form.Item
                label='Cabinet:'
                name='cabinet'>
                <Input/>
            </Form.Item>
            <Form.Item
                label='Title:'
                name='title'>
                <Input/>
            </Form.Item>

            <Form.Item
                label='Teacher:'
                name='teacher'>
                <Input/>
            </Form.Item>

            <Form.Item 
                label='Start-time'
                name='startTime'>
                <DatePicker showTime/>
            </Form.Item>

            <Form.Item 
                label='End-time'
                name='endTime'>
                <DatePicker showTime/>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 18, span: 16 }}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
        <Table columns={columns} dataSource={lessons}/>
    </Layout>
  )
}

export default Lessons