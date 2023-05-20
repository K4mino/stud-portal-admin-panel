import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getDoc,doc, updateDoc,  arrayRemove,onSnapshot,collection, getDocs, arrayUnion } from 'firebase/firestore'
import { Button, Form, Input,Checkbox } from 'antd'
import styled from 'styled-components'
import Layout from '../Layout'
import { auth, db } from '../../firebase'
import { updateProfile} from 'firebase/auth'

const StyledForm = styled(Form)`
    width:600px;
    padding:20px;
    border-radius:24px;
    margin-top:4%;
`;

const LessonList = styled(Form)`
    display:flex;
    flex-direction:column;
    gap:10px;
    margin-bottom:20px;
    position: relative;
    border-bottom:2px solid #333;
    padding-bottom:10px;
`;

const LessonTaskList = styled.div`
    display:flex;
    flex-direction:column;
    gap:10px;
    margin-bottom:20px;
`;

const DeleteLesson = styled(Button)`
    position:absolute;
    top:10px;
    right:10px;
    background-color:red;
    color:#fff;
`;

const DeleteTask = styled(Button)`
    background-color:red;
    color:#fff;

`;
const UpdateLesson = styled(Button)`
    background-color:green;
    color:#fff;

`;


const Back = styled(Button)`
    position:absolute;
    left:15%;
    top:10px;
`;

const StyledCheckbox =  styled.div`
    position:absolute;
    left:20%;
    top:15px;
`;

const Update = () => {
    const {id} = useParams()
    const [form] = Form.useForm()
    const [isDisabled,setIsDisabled] = useState(true)
    const [lessons,setLessons] = useState([])
    const navigate = useNavigate()
   /*  useEffect(()=>{
        const getData = async() => {
            const res = await getDoc(doc(db,'users',id))
            const data = await res.data()
            form.setFieldsValue({email:data.email,password:data.password})
            setLessons(data.lessons)
        }
        
        getData()
    },[id])  */

    useEffect(()=> {
        const unsub = onSnapshot(doc(db,'users',id),async(snapShot) => {
         let list = []
         for (const item of snapShot.data().lessons){
            const path = item.path;
            const lessonId = path.split('/').pop();
            const lesson = await getDoc(doc(db,'lessons',lessonId))
            list.push(lesson.data())
         }
         setLessons(list)
         form.setFieldsValue({email:snapShot.data().email,password:snapShot.data().password})
        })
    
        return () => {
          unsub();
        }
      },[form])

    const handleUpdate = async() => {
        const user = auth.currentUser
        const {email,password} = form.getFieldsValue();
        await updateProfile(user,{
            email,
        })
        await updateDoc(doc(db,'users',id),{
            email,
            password
        })
        navigate(-1)
    }


    const handleDeleteLesson = async(lessonIndx)=> {
       try {
        const userRef = doc(db, 'users', id);
        const userDoc = await getDoc(userRef);
        const user = userDoc.data();
        user.lessons.splice(lessonIndx, 1);
        await updateDoc(doc(db,'users',id),{
            lessons: user.lessons
        })
       } catch (error) {
        console.log(error)
    }
    }

    const handleDeleteTask = async(lessonIndx,taskIndx) => {
        try {
            let updatedLessons = lessons.map((ls,i) => {
                if(lessonIndx == i){
                    let newTasks = ls.tasks.filter((task,i) => i !== taskIndx)
                    ls.tasks = newTasks
                }
                return ls
            })
            await updateDoc(doc(db,'users',id),{
                lessons:updatedLessons
            })
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <Layout>
        <Back 
            onClick={()=>navigate(-1)}
            type='primary'>
                Back
        </Back>
        <StyledCheckbox>
        <Checkbox onChange={(e)=>setIsDisabled(e.target.checked)}
            checked={isDisabled}
            />Form disabled
        </StyledCheckbox>
        <StyledForm
            initialValues={{ remember: true }}
            form={form}
            disabled={isDisabled}
            name="basic"
            onFinish={handleUpdate}
            autoComplete="off"
        >
            <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input your username!' }]}
            >
                <Input/>
            </Form.Item>

            <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
            >
                <Input/>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>

            <Button onClick={()=>navigate(`/main/update/${id}/addlesson`)}>Add lesson</Button>

            {
                lessons?.map((lesson,i) => (
                    <>
                        <LessonList key={lesson.name}>
                        <DeleteLesson onClick={() => handleDeleteLesson(i)}>Delete</DeleteLesson>
                            <h2>{lesson.name}</h2>
                            <Form.Item
                                label='Lesson-name'
                                name='lessonName'
                                initialValue={lesson.name}>
                                <Input/>
                            </Form.Item>
                            <Form.Item
                                label='Cabinet'
                                name='cabinet'
                                initialValue={lesson.cabinet}>
                                <Input/>
                            </Form.Item>
                            <Form.Item
                                label='Date'
                                name='date'>
                                <Input type='date'/>
                            </Form.Item>
                            {/* <LessonTaskList>
                                {
                                    lesson?.tasks?.sort((a,b) => a.week.localeCompare(b.week)).map((task,taskIndx) => (
                                        <>
                                        <h2>Week:{task.week}</h2>
                                        <h3>{task?.description}</h3>
                                        <Input type='file'/>
                                        <a href={task.materials}>{task.materialLink}</a>
                                        <DeleteTask onClick={() => handleDeleteTask(i,taskIndx)}>Delete Task</DeleteTask>
                                        </>
                                    ))
                                }
                            </LessonTaskList> */}
                        </LessonList>
                    </>
                ))
            }
        </StyledForm>
    </Layout>
  )
}

export default Update