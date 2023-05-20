import React, { useState } from 'react';
import Layout from '../Layout';
import {Form,Input,Button,Upload,Table} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { doc, setDoc,onSnapshot,collection, deleteDoc, getDoc, updateDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { db, storage } from '../../firebase';
import { ref, uploadBytes } from 'firebase/storage';
import { useEffect } from 'react';

const Wrapper = styled.div`
  padding:20px;
  display:flex;
  flex-direction:column;
  width:100%;
`;

const StyledForm = styled(Form)`
  border-bottom:2px solid black;
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


const MainNews = () => {
    const [form] = Form.useForm();
    const [newsImage,setNewsImage] = useState(null)
    const [newsList,setNewsList] = useState([])
    const [updatingNews,setUpdatingNews] = useState('')

    const columns = [
        {
          title:'Id',
          dataIndex:'id',
          key:'id'
        },
        {
          title:'Title',
          dataIndex:'title',
          key:'title'
        },
        {
            title:'Description',
            dataIndex:'description',
            key:'description'
        },
        {
            title:'Image Link',
            dataIndex:'imageLink',
            key:'imageLink'
        },
        {
          title:'Action',
          key:'action',
          render:(_,record) => (
            <>
            <Delete onClick={() =>handleDeleteNews(record.id)}>
              Delete
            </Delete>
            <Update onClick={() => handleUpdateNews(record.id)}>
              Update 
            </Update>
            </>
          )
        }
      ]

      useEffect(()=> {
        const unsub = onSnapshot(collection(db,'news'),(snapShot) => {
          let list = []
          snapShot.docs.forEach((doc) => {
            list.push(doc.data())
          })
          setNewsList(list);
        })
    
        return () => {
          unsub();
        }
      },[])

    const handleCreateNews = async() => {
      if(newsImage == null) return;
        const {title,description} = form.getFieldsValue()
        let id = uuidv4();
        const newsRef = ref(storage,`newsImages/${newsImage.name}`)
        const format = newsImage.name.split('.').pop();
        const metadata = { contentType: `image/${format}` };
        let imageLink = `newsImages/${newsImage.name}`
        try {
            await setDoc(doc(db,'news',id),{
                id,
                title,
                description,
                imageLink
            })
            await uploadBytes(newsRef,newsImage.originFileObj)
            form.setFieldsValue({
                title:'',
                description:'',
                image:null
            })
            setNewsImage(null)
        } catch (error) {
            console.log(error)
        }
    }

    const handleDeleteNews = async(id) => {
        try {
            await deleteDoc(doc(db,'news',id))
        } catch (error) {
            console.log(error)
        }
    }   

    const handleUpdateNews = async(id) => {
      setUpdatingNews(id)
      const res = await getDoc(doc(db,'news',id))
      const data = res.data()
      form.setFieldsValue({
        title:data.title,
        description:data.description,
      })
    }

    const handleSaveUpdateNews = async() => {
      const {title,description} = form.getFieldsValue()
      let imageLink = `newsImages/${newsImage.name}`
      await updateDoc(doc(db,'news',updatingNews),{
        title,
        description,
        imageLink
      })
      form.setFieldsValue({
        title:'',
        description:'',
        image:null
      })
    }

  return (
    <Layout>
        <Wrapper>
        <StyledForm
            form={form}
            name="basic"
            initialValues={{ remember: true }}
            onFinish={handleCreateNews}
            autoComplete="off"
            >
            <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: 'Please input title' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
            label="Description"
            name="description"
            rules={[{ message: 'Please input description' }]}
            >
              <Input.TextArea rows={4}
                placeholder='Description...'
                />
            </Form.Item>

            <Form.Item
                label='Image'
                name='image'
                rules={[{ required: true, message: 'Please upload image' }]}>
            <Upload name='file'
                fileList={[]}
                onChange={(e)=> setNewsImage(e.file)}>
                <Button icon={<UploadOutlined/>}>Click to upload</Button>
            </Upload>
            </Form.Item>

            <div style={{display:'flex'}}>
            <Form.Item wrapperCol={{ offset: 16, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 18, span: 16 }}>  
              <Button
              onClick={handleSaveUpdateNews}
              type="primary">
                Save Update
              </Button>
            </Form.Item>
            </div>
          </StyledForm>
          <Table columns={columns} dataSource={newsList}/>
        </Wrapper>
    </Layout>
  )
}

export default MainNews