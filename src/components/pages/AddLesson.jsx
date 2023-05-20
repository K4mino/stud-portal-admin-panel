import { Form, Input,Button,DatePicker,Table } from 'antd'
import { arrayUnion, doc,updateDoc,onSnapshot,collection,getDoc } from 'firebase/firestore'
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { db } from '../../firebase'
import Layout from '../Layout'

const AddLesson = () => {
    const [form] = Form.useForm()
    const {id} = useParams()
    const navigate = useNavigate()
    const [lessons,setLessons] = useState([])

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
          title:'Action',
          key:'action',
          render:(_,record) => (
            <>
                <Button onClick={() => handleAddLesson(record.uid)}>Add</Button>
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

    const handleAddLesson = async(lessonId) => {
        try {
            const userRef = doc(db, 'users', id);
            const userDoc = await getDoc(userRef);
            const userData = userDoc.data();
            userData.lessons.push(doc(db, 'lessons', lessonId));
            await updateDoc(userRef, {
                lessons: userData.lessons
              });
            alert('success')
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <Layout>
        {/* <Form
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

                <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
        </Form> */}
        <Table title={() => <h1>Lesson List</h1>} columns={columns} dataSource={lessons}/>
    </Layout>
  )
}

export default AddLesson