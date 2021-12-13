import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import 'antd/dist/antd.css';
import './App.css';
import { Tabs, Modal, Table, Button, Input, Space } from 'antd';
import { useState } from 'react';
import { addLink, deleteLink } from '../main/store';

const Store = require('electron-store');

const store = new Store();
if (store.get('links') === undefined) {
  store.set('links', []);
}
const { ipcRenderer } = require('electron');

const error = {
  color: 'red',
  fontSize: '10px',
  fontWeight: 400,
};
// import icon from '../../assets/icon.svg';

const { TabPane } = Tabs;

const Demo = () => {
  const [data, setData] = useState(store.get('links'));

  const deleteElement = (e: any) => {
    deleteLink(e);
    setData(store.get('links'));
  };
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Link',
      dataIndex: 'link',
      key: 'link',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: any, record: any) => (
        <Button
          onClick={(e) => {
            deleteElement(record.id);
          }}
        >
          Delete
        </Button>
      ),
    },
  ];

  // const data = store.get('links');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newValue, setNewValue] = useState({ title: '', link: '' });
  const [titleReq, setTitleReq] = useState(false);
  const [linkReq, setLinkReq] = useState(false);
  const [linkValid, setLinkValid] = useState(false);

  ipcRenderer.on('goToAddLink', function () {
    setIsModalOpen(true);
  });
  const onCloseModal = () => {
    setIsModalOpen(false);
  };
  const onCloseAddModal = () => {
    setIsAddModalOpen(false);
    setIsModalOpen(true);
  };
  const openAddModal = () => {
    setIsModalOpen(false);
    setIsAddModalOpen(true);
  };
  function isValidHttpUrl(string: string | URL) {
    let url;

    try {
      url = new URL(string);
    } catch (_) {
      return false;
    }

    return url.protocol === 'http:' || url.protocol === 'https:';
  }
  const onOkAddModal = () => {
    setTitleReq(false);
    setLinkReq(false);
    setLinkValid(false);

    let errorcount = 0;
    if (!newValue.title) {
      errorcount += 1;
      setTitleReq(true);
    }
    if (!newValue.link) {
      errorcount += 1;
      setLinkReq(true);
    } else if (!isValidHttpUrl(newValue.link)) {
      errorcount += 1;
      setLinkValid(true);
    }
    if (!errorcount) {
      addLink(newValue.title, newValue.link);
      setData(store.get('links'));
      setIsAddModalOpen(false);
      setIsModalOpen(true);
    }
  };

  const handleInputChange = (event: { target: { id: any; value: any } }) => {
    setNewValue(() => ({
      ...newValue,
      [event.target.id]: event.target.value,
    }));
  };
  const items: any = [];
  if (!data.length) {
    items.push(
      <TabPane className="panel" tab="Welcome" key="tab">
        Welcome to riod live. to add link press ctrl+ L
      </TabPane>
    );
  }
  data.forEach((value: any) => {
    items.push(
      <TabPane className="panel" tab={value.title} key={value.id}>
        <webview
          id={value.id}
          src={value.link}
          nodeintegration
          disablewebsecurity
          webpreferences="allowRunningInsecureContent"
          className="lalaal"
        />
      </TabPane>
    );
  });
  // for (const [index, value] of data.entries()) {

  // }
  return (
    <>
      <Modal
        title="Basic Modal"
        cancelButtonProps={{ style: { display: 'none' } }}
        visible={isModalOpen}
        onOk={onCloseModal}
        onCancel={onCloseModal}
      >
        <Button onClick={openAddModal}>Add Link</Button>
        <Table columns={columns} pagination={false} dataSource={data} />
      </Modal>
      <Modal
        title="add Modal"
        visible={isAddModalOpen}
        onCancel={onCloseAddModal}
        onOk={onOkAddModal}
      >
        <Space direction="vertical">
          <Input
            type="text"
            id="title"
            placeholder="Title"
            value={newValue.title}
            onChange={handleInputChange}
          />
          {titleReq && <div style={error}>required</div>}
          <Input
            type="text"
            id="link"
            placeholder="Link"
            value={newValue.link}
            onChange={handleInputChange}
          />
          {linkReq && <div style={error}>required</div>}
          {linkValid && <div style={error}>invalid url</div>}
        </Space>
      </Modal>
      <Tabs defaultActiveKey="1" type="card">
        {items}
        {/* <TabPane className="panel" tab="Tab 1" key="1">
          <webview
            id="1"
            src="https://www.github.com/"
            nodeintegration
            disablewebsecurity
            webpreferences="allowRunningInsecureContent"
            className="lalaal"
          />
        </TabPane>
        <TabPane tab="Tab 2" key="2">
          <webview
            id="2"
            src="https://www.google.com/"
            nodeintegration
            disablewebsecurity
            webpreferences="allowRunningInsecureContent"
            className="lalaal"
          />
        </TabPane>
        <TabPane tab="Tab 3" key="3">
          Content of Tab Panel 3
        </TabPane> */}
        {/* <webview
        id="1"
        src="https://www.github.com/"
        nodeintegration
        httpreferrer="http://cheng.guru"
        disablewebsecurity
        webpreferences="allowRunningInsecureContent"
      /> */}
      </Tabs>
    </>
  );
};

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Demo} />
      </Switch>
    </Router>
  );
}
