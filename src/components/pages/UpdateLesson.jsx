import { Form, Input,Button,DatePicker } from 'antd'
import React from 'react'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getDoc,doc, updateDoc, arrayUnion, arrayRemove, Timestamp } from 'firebase/firestore'
import dayjs from 'dayjs'

import { db } from '../../firebase'
import Layout from '../Layout'
import { useState } from 'react'

const UpdateLesson = () => {
    const {lessonId} = useParams()
    const [lesson,setLesson] = useState({})
    const [form] = Form.useForm()
    const navigate = useNavigate()
    
    useEffect(()=> {
        const getData = async() => {
            const res = await getDoc(doc(db,'lessons',lessonId))
            setLesson(res.data())
            console.log(res.data())
            const data = res.data()
            form.setFieldsValue({
                lessonName:data.name,
                cabinet:data.cabinet,
                title:data.title,
                teacher:data.teacher,
                startTime:dayjs(data.start.toDate()),
                endTime:dayjs(data.end.toDate()),
            })
        }
        
        getData()
    },[])

    const handleUpdateLesson = async() => {
        const {lessonName,cabinet,title,teacher,startTime,endTime} = form.getFieldsValue()
        try {
            await updateDoc(doc(db,'lessons',lessonId),{
                name:lessonName,
                cabinet,
                title,
                teacher,
                start:startTime.$d,
                end:endTime.$d,
                tasks:[...lesson.tasks]
            }) 
        } catch (error) {
            console.log(error)
        }
        navigate(-1)
    }

  return (
    <Layout>
        <Form
            onFinish={handleUpdateLesson}
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
                    <DatePicker 
                        showTime/>
                </Form.Item>

                <Form.Item 
                    label='End-time'
                    name='endTime'>
                    <DatePicker showTime />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
        </Form>
    </Layout>
  )
}

export default UpdateLesson