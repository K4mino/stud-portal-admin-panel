import { Form, Input,Button,Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons';
import React,{useEffect} from 'react'
import { getDoc,doc, updateDoc, arrayUnion } from 'firebase/firestore'
import { useNavigate, useParams} from 'react-router-dom'
import { db, storage } from '../../firebase'
import Layout from '../Layout'
import { useState } from 'react'
import { ref, uploadBytes } from 'firebase/storage';

const AddTask = () => {
    const {id,lessonId} = useParams()
    const [form] = Form.useForm()
    const [lesson,setLesson] = useState({})
    const [lessonList,setLessonList] = useState([])
    const [material,setMaterial] =useState(null)
    const navigate = useNavigate()

    useEffect(()=> {
        const getData = async() => {
            const res = await getDoc(doc(db,'users',id))
            const data = await res.data().lessons[lessonId]
            setLesson(data)
            setLessonList(res.data().lessons)
        }
        
        getData()
    },[])

    const handleAddTask = async() => {
        const {week} = form.getFieldsValue() 
        const materialsRef = ref(storage,`studyMaterials/${lesson.name}/${week}/material-for-week-${week}`)
        let materialLink = `studyMaterials/${lesson.name}/${week}`
        if(material == null) return;

        let newTask = {
            week,
            materialLink
        }
    
        let updatedLessons = lessonList.map((ls,i) => {
            if(i == lessonId){
                ls.tasks.push(newTask)
            }
            return ls
        })

        await uploadBytes(materialsRef,material)
        await updateDoc(doc(db,'users',id),{
            lessons:updatedLessons
        })
        navigate(-1)
    }

  return (
    <Layout>
        <Form
            form={form}
            onFinish={handleAddTask}>
            <Form.Item
                label='Week'
                name='week'>
                <Input/>
            </Form.Item>
            <Upload name='file'
                onChange={(e)=> setMaterial(e.file)}>
                <Button icon={<UploadOutlined/>}>Click to upload</Button>
            </Upload>

            <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    </Layout>
  )
}

export default AddTask