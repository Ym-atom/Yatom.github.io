import { ReactNode, useState, useEffect, useRef } from 'react';
import css from './guide.less';
import uploadIcon from "@/assets/upload.png";
import Toast from '@/components/toast/toast';
import Message from '@/components/message/message';
import Modal from '@/components/modal/modal';
import { classNames, getHeroInfoList } from '@/utils/util';
import longText from '@/config/longText';
import HeroInfo from './hero-info/hero-info';
import customTitleIcon from '@/assets/custom-title.png';
import Drawer from '@/components/drawer/drawer';
import Popover from '@/components/popover/popover';
import List from '@/components/list/list';
import { HeroInfoT } from '@/types/types';

const Guide: React.FC<{
  componentTitle: string;
  componentName: string;
}> = ({ componentTitle, componentName }) => {
  const ref = useRef(null);
  useEffect(() => {
  }, [])
  if (!location) {
    return null;
  }
  return (
    <div className={css.block} ref={ref}>
      <div className={css.title}>{componentName} {componentTitle}</div>
      <div className={css.main}>
        {map[componentName]}
      </div>
    </div>
  )
}
export default Guide;

const ListGuide: React.FC<{}> = () => {
  const [heroInfoList, setHeroInfoList] = useState<HeroInfoT[]>([]); // 英雄信息列表
  const [hasMore, setHasMore] = useState(true); // 是否还有更多
  let startIndex = 0; // 当前请求列表的起始索引
  useEffect(() => {
    addDataToHeroInfoList();
  }, []);
  /** 初始化或重新刷新列表 */
  const initHeroInfoList = function () {
    setHasMore(true);
    setHeroInfoList([]);
    startIndex = 0;
    addDataToHeroInfoList();
  }
  /** 加载更多数据 */
  const addDataToHeroInfoList = async function () {
    const list = await getHeroInfoList(startIndex, 10);
    if (list.length === 0) {
      setHasMore(false); // 不再有新数据
      return;
    }
    setHeroInfoList(e => e.concat(list));
    startIndex += 10;
  }
  return (
    <>
      <List
        hasMore={hasMore}
        onNearBottom={() => { addDataToHeroInfoList() }}
        onHeaderReleased={() => { initHeroInfoList() }}
      >
        {heroInfoList.map((item, index) => (
          <List.Item key={index}>
            <HeroInfo info={item} />
          </List.Item>
        ))}
      </List>
    </>
  )
}

const ToastGuide: React.FC<{}> = () => {
  return (
    <>
      <div className={classNames(css.button, 'button')} onClick={() => {
        Toast.show('Toast 轻提示')
      }}>轻提示</div>
      <div className={classNames(css.button, 'button')} onClick={() => {
        Toast.show({
          content: <div className={css['custom-text']}>自定义文本</div>
        })
      }}>自定义文本</div>
      <br />
      <div className={classNames(css.button, 'button')} onClick={() => {
        Toast.show({
          content: '成功',
          icon: 'success',
          bodyStyle: { backgroundColor: '#009A61' }
        })
      }}>成功</div>
      <div className={classNames(css.button, 'button')} onClick={() => {
        Toast.show({
          content: '失败',
          icon: 'fail',
          bodyStyle: { backgroundColor: '#cf1322' }
        })
      }}>失败</div>
      <div className={classNames(css.button, 'button')} onClick={() => {
        Toast.show({
          content: '加载中',
          icon: 'loading',
          duration: 0,
        })
      }}>加载中</div>
      <div className={classNames(css.button, 'button')} onClick={() => {
        Toast.show({
          content: '上传中',
          icon: <img src={uploadIcon} className={css['upload-icon']} />,
        })
      }}>自定义图标</div>
      <br />
      <div className={classNames(css.button, 'button')} onClick={() => {
        Toast.show({
          content: '成功',
          icon: 'success',
          direction: 'row',
        })
      }}>水平布局</div>
      <div className={classNames(css.button, 'button')} onClick={() => {
        Toast.show({
          content: '请耐心等待',
          maskClickable: false,
        })
      }}>阻止背景点击</div>
      <br />
      <div className={classNames(css.button, 'button')} onClick={() => {
        Toast.show({
          content: '不会消失的 Toast',
          duration: 0,
        })
      }}>不会消失的 Toast</div>
      <div className={classNames(css.button, 'button')} onClick={() => {
        Toast.clear();
      }}>清除当前 Toast</div>
      <br />
      <div className={classNames(css.button, 'button')} onClick={() => {
        Toast.show({
          content: '加载中',
          icon: 'loading',
          duration: 0,
        })
        setTimeout(() => {
          const rdm = Math.random();
          if (rdm >= 0.2) {
            Toast.show({
              content: '成功',
              icon: 'success',
              bodyStyle: { backgroundColor: '#009A61' }
            })
          } else {
            Toast.show({
              content: '失败',
              icon: 'fail',
              bodyStyle: { backgroundColor: '#cf1322' }
            })
          }
        }, 1000);
      }}>模拟网络请求</div>
      <br />
      <div className={classNames(css.button, 'button')} onClick={() => {
        Toast.show({
          content: '可打开控制台查看',
          onClose: () => { console.log('Toast 关闭'); }
        })
      }}>关闭时触发回调函数</div>
    </>
  );
};

const MessageGuide: React.FC<{}> = () => {
  return (
    <>
      <div className={classNames(css.button, 'button')} onClick={() => {
        Message.show('Message 全局提示')
      }}>全局提示</div>
      <div className={classNames(css.button, 'button')} onClick={() => {
        Message.show({
          content: <div className={css['custom-text']}>自定义文本</div>,
        })
      }}>自定义文本</div>
      <br />
      <div className={classNames(css.button, 'button')} onClick={() => {
        Message.show({
          content: '成功',
          icon: 'success',
          bodyStyle: { backgroundColor: '#009A61' }
        })
      }}>成功</div>
      <div className={classNames(css.button, 'button')} onClick={() => {
        Message.show({
          content: '失败',
          icon: 'fail',
          bodyStyle: { backgroundColor: '#cf1322' }
        })
      }}>失败</div>
      <div className={classNames(css.button, 'button')} onClick={() => {
        Message.show({
          content: '加载中',
          icon: 'loading',
          duration: 0
        })
      }}>加载中</div>
      <div className={classNames(css.button, 'button')} onClick={() => {
        Message.show({
          content: '上传中',
          icon: <img src={uploadIcon} className={css['upload-icon-small']} />,
        })
      }}>自定义图标</div>
      <br />
      <div className={classNames(css.button, 'button')} onClick={() => {
        Message.show({
          content: '不会消失的 Message',
          duration: 0
        });
      }}>不会消失的 Message</div>
      <div className={classNames(css.button, 'button')} onClick={() => {
        Message.clear();
      }}>清除所有 Message</div>
      <br />
      <div className={classNames(css.button, 'button')} onClick={() => {
        Message.show({
          content: '可打开控制台查看',
          onClose: () => { console.log('Message 关闭'); }
        })
      }}>关闭时触发回调函数</div>
    </>
  );
};

const ModalGuide: React.FC<{}> = () => {
  const [showModal_1, setShowModal_1] = useState(false);
  const [showModal_2, setShowModal_2] = useState(false);
  const [showModal_3, setShowModal_3] = useState(false);
  const [showModal_4, setShowModal_4] = useState(false);
  return (
    <>
      <div className={css.tips}>声明式调用</div>
      <div className={classNames(css.button, 'button')} onClick={() => { setShowModal_1(true) }}>显示弹窗</div>
      <div className={classNames(css.button, 'button')} onClick={() => { setShowModal_2(true) }}>自定义内容区域</div>
      <div className={classNames(css.button, 'button')} onClick={() => { setShowModal_3(true) }}>超长文本</div>
      <br />
      <div className={classNames(css.button, 'button')} onClick={() => { setShowModal_4(true) }}>表单弹窗</div>
      <Modal
        visible={showModal_1}
        title='提示'
        onCancel={() => {
          setShowModal_1(false);
        }}
        onOk={() => {
          Toast.show('点击了确定');
        }}
        onClose={() => {
          setShowModal_1(false);
        }}
      >
        你可以通过改变 visible 的值来控制弹窗的显示与隐藏
      </Modal>
      <Modal
        visible={showModal_2}
        title='手持工牌照示例'
        footer={
          <div
            className={classNames(css['modal-custom-footer-button'], 'primary-button')}
            onClick={() => { setShowModal_2(false) }}
          >
            我知道了
          </div>
        }
        onCancel={() => {
          setShowModal_2(false);
        }}
        onClose={() => {
          setShowModal_2(false);
        }}
      >
        <div className={css['modal-custom-content']}>
          <img
            className={css['modal-custom-content-img']}
            src="https://dldir1.qq.com/INO/xiaoe/inline/modal-photo.png"
          />
          <div>请用手机拍摄手持工牌照，注意保持照片清晰</div>
        </div>
      </Modal>
      <Modal
        visible={showModal_3}
        title='用户须知协议'
        footerCentered={true}
        footer={
          <div
            className={classNames(css['modal-custom-footer-button'], 'primary-button')}
            onClick={() => { setShowModal_3(false) }}
          >
            我知道了
          </div>
        }
        onCancel={() => {
          setShowModal_3(false);
        }}
        onClose={() => {
          setShowModal_3(false);
        }}
      >
        {longText}
      </Modal>
      <Modal
        visible={showModal_4}
        title='表单'
        onOk={() => {
          Toast.show('提交内容可在控制台查看');
          const formDom = document.getElementsByTagName('form')[0];
          const formData = new FormData(formDom);
          let jsonData: any = {};
          formData.forEach((value, key) => jsonData[key] = value);
          console.log(jsonData);
        }}
        onCancel={() => {
          setShowModal_4(false);
        }}
        onClose={() => {
          setShowModal_4(false);
        }}
      >
        <div className={css["modal-form"]}>
          <form name="form">
            <h1>联系我们
              <span>请将信息填写完整，方便我们后续联系</span>
            </h1>
            <label>
              <span>您的姓名：</span>
              <input id="name" type="text" name="name" placeholder="请填写姓名" />
            </label>
            <label>
              <span>您的邮箱：</span>
              <input id="email" type="email" name="email" placeholder="请填写邮箱" />
            </label>
            <label>
              <span>消息内容：</span>
              <textarea id="message" name="message" placeholder="反馈信息给我们"></textarea>
            </label>
            <label>
              <span>内容类型：</span>
              <select name="selection">
                <option value="comment">评论</option>
                <option value="report">举报</option>
              </select>
            </label>
          </form>
        </div>
      </Modal>
      <div className={css.tips}>指令式调用</div>
      <div className={classNames(css.button, 'button')} onClick={() => {
        Modal.show({
          title: '提示',
          content: 'Modal 弹窗',
          width: 300,
        })
      }}>最简单的弹窗</div>
      <div className={classNames(css.button, 'button')} onClick={() => {
        Modal.show({
          title: '提示',
          titleCentered: false,
          content: 'Modal 弹窗',
          onCancel() {
            Toast.show('点击了取消');
          },
          onOk() {
            Toast.show('点击了确定');
          },
        })
      }}>有回调的弹窗</div>
      <br />
      <div className={classNames(css.button, 'button')} onClick={() => {
        Modal.show({
          title:
            <div className={css['modal-custom-title']}>
              <img className={css['modal-custom-title-icon']} src={customTitleIcon} />
              <span>自定义标题</span>
            </div>,
          titleCentered: false,
          content: 'Modal 弹窗',
          footerCentered: true,
          footer:
            <div
              className={classNames(css['modal-custom-footer-button'], 'primary-button')}
              onClick={() => { Modal.clear() }}
            >
              自定义底部按钮
            </div>,
          width: 300,
        })
      }}>自定义标题和底部按钮</div>
      <div className={classNames(css.button, 'button')} onClick={() => {
        Modal.show({
          title: '手持工牌照示例',
          content:
            <div className={css['modal-custom-content']}>
              <img
                className={css['modal-custom-content-img']}
                src="https://dldir1.qq.com/INO/xiaoe/inline/modal-photo.png"
              />
              <div>请用手机拍摄手持工牌照，注意保持照片清晰</div>
            </div>,
          footerCentered: true,
          footer:
            <div
              className={classNames(css['modal-custom-footer-button'], 'primary-button')}
              onClick={() => { Modal.clear() }}
            >
              我知道了
            </div>,
        })
      }}>自定义内容区域</div>
    </>
  );
};

const DrawerGuide: React.FC<{}> = () => {
  const text = `抽屉从父窗体边缘滑入，覆盖住部分父窗体内容。用户在抽屉内操作时不必离开当前任务，操作完成后，可以平滑地回到原任务。
当需要一个附加的面板来控制父窗体内容，这个面板在需要时呼出。比如，控制界面展示样式，往界面中添加内容。
当需要在当前任务流中插入临时任务，创建或预览附加内容。比如展示协议条款，创建子对象。`
  const [showDrawer_1, setShowDrawer_1] = useState(false);
  const [showDrawer_2, setShowDrawer_2] = useState(false);
  const [showDrawer_3, setShowDrawer_3] = useState(false);
  const [showDrawer_4, setShowDrawer_4] = useState(false);
  const [showDrawer_5, setShowDrawer_5] = useState(false);
  const [showDrawer_6, setShowDrawer_6] = useState(false);
  const [showDrawer_7, setShowDrawer_7] = useState(false);
  const [showDrawer_8, setShowDrawer_8] = useState(false);
  const [showDrawer_9, setShowDrawer_9] = useState(false);
  return (
    <>
      <div className={classNames(css.button, 'button')} onClick={() => { setShowDrawer_1(true) }}>底部弹出</div>
      <div className={classNames(css.button, 'button')} onClick={() => { setShowDrawer_2(true) }}>顶部弹出</div>
      <div className={classNames(css.button, 'button')} onClick={() => { setShowDrawer_3(true) }}>左侧弹出</div>
      <div className={classNames(css.button, 'button')} onClick={() => { setShowDrawer_4(true) }}>右侧弹出</div>
      <Drawer
        visible={showDrawer_1}
        position={'bottom'}
        // maskClassName={css['custom-mask']}
        // bodyClassName={css['custom-body']}
        onClose={() => {
          setShowDrawer_1(false);
        }}
      >
        {text}
      </Drawer>
      <Drawer
        visible={showDrawer_2}
        position={'top'}
        onClose={() => {
          setShowDrawer_2(false);
        }}
      >
        {text}
      </Drawer>
      <Drawer
        visible={showDrawer_3}
        position={'left'}
        onClose={() => {
          setShowDrawer_3(false);
        }}
      >
        {text}
      </Drawer>
      <Drawer
        visible={showDrawer_4}
        position={'right'}
        onClose={() => {
          setShowDrawer_4(false);
        }}
      >
        {text}
      </Drawer>
      <br />
      <div className={classNames(css.button, 'button')} onClick={() => { setShowDrawer_5(true) }}>圆角抽屉</div>
      <div className={classNames(css.button, 'button')} onClick={() => { setShowDrawer_6(true) }}>标题和关闭按钮</div>
      <div className={classNames(css.button, 'button')} onClick={() => { setShowDrawer_7(true) }}>内容超长滚动</div>
      <Drawer
        visible={showDrawer_5}
        onClose={() => {
          setShowDrawer_5(false);
        }}
        position={'bottom'}
        bodyStyle={{
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px',
        }}
      >
        {text}
      </Drawer>
      <Drawer
        visible={showDrawer_6}
        title={
          <div className={css['modal-custom-title']}>
            <img className={css['modal-custom-title-icon']} src={customTitleIcon} />
            <span>自定义标题</span>
          </div>
        }
        closable={true}
        onClose={() => {
          setShowDrawer_6(false);
        }}
      >
        {text}
      </Drawer>
      <Drawer
        visible={showDrawer_7}
        title='用户须知协议'
        closable={true}
        onClose={() => {
          setShowDrawer_7(false);
        }}
      >
        {longText}
      </Drawer>
      <br />
      <div className={classNames(css.button, 'button')} onClick={() => { setShowDrawer_8(true) }}>多层抽屉</div>
      <Drawer
        visible={showDrawer_8}
        position={'bottom'}
        onClose={() => {
          setShowDrawer_8(false);
        }}
      >
        <div>这是第一层抽屉</div>
        <br />
        <div className={classNames(css.button, 'button')} onClick={() => { setShowDrawer_9(true) }}>打开第二层抽屉</div>
      </Drawer>
      <Drawer
        visible={showDrawer_9}
        position={'bottom'}
        bodyStyle={{ height: '200px' }}
        onClose={() => {
          setShowDrawer_9(false);
        }}
      >
        <div>这是第二层抽屉</div>
      </Drawer>
    </>
  );
};

const PopoverGuide: React.FC<{}> = () => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <div className={css.tips}>Click 触发</div>
      <Popover
        content={'popover'}
        trigger={'click'}
        placement={'top-right'}
      >
        <div className={classNames(css.button, 'button')}>Click 触发</div>
      </Popover>
      {/* <Popover
        content={'popover'}
        placement={'top-right'}
        visible={visible}
      >
        <div
          className={classNames(css.button, 'button')}
          onClick={() => setVisible(!visible)}
        >
          通过控制 visible 触发
        </div>
      </Popover> */}
      <Popover
        content={'popover-blue-style'}
        trigger={'click'}
        placement={'top-right'}
        textColor={'#fff'}
        bodyBgColor={'#2db7f5'}
      >
        <div className={classNames(css.button, 'button')}>自定义颜色和背景</div>
      </Popover>
      <div className={css.tips}>Hover 触发（PC 端适用）</div>
      <div className={css['horizontal-box']}>
        <Popover
          content={'popover-top-left'}
          trigger={'hover'}
          placement={'top-left'}
        >
          <div className={classNames(css.button, 'button')}>top-left</div>
        </Popover>
        <Popover
          content={'popover-top'}
          trigger={'hover'}
          placement={'top'}
        >
          <div className={classNames(css.button, 'button')}>top</div>
        </Popover>
        <Popover
          content={'popover-top-right'}
          trigger={'hover'}
          placement={'top-right'}
        >
          <div className={classNames(css.button, 'button')}>top-right</div>
        </Popover>
      </div>
      <div className={css['horizontal-box']}>
        <Popover
          content={'popover-bottom-left'}
          trigger={'hover'}
          placement={'bottom-left'}
        >
          <div className={classNames(css.button, 'button')}>bottom-left</div>
        </Popover>
        <Popover
          content={'popover-bottom'}
          trigger={'hover'}
          placement={'bottom'}
        >
          <div className={classNames(css.button, 'button')}>bottom</div>
        </Popover>
        <Popover
          content={'popover-bottom-right'}
          trigger={'hover'}
          placement={'bottom-right'}
        >
          <div className={classNames(css.button, 'button')}>bottom-right</div>
        </Popover>
      </div>
      <div className={css['horizontal-box']}>
        <Popover
          content={`popover-right-top\npopover-right-top`}
          trigger={'hover'}
          placement={'right-top'}
        >
          <div className={classNames(css.button, 'button')}>right-top</div>
        </Popover>
        <Popover
          content={`popover-right\npopover-right`}
          trigger={'hover'}
          placement={'right'}
        >
          <div className={classNames(css.button, 'button')}>right</div>
        </Popover>
        <Popover
          content={`popover-right-bottom\npopover-right-bottom`}
          trigger={'hover'}
          placement={'right-bottom'}
        >
          <div className={classNames(css.button, 'button')}>right-bottom</div>
        </Popover>
      </div>
      <div className={css['horizontal-box']}>
        <Popover
          content={`popover-left-top\npopover-left-top`}
          trigger={'hover'}
          placement={'left-top'}
        >
          <div className={classNames(css.button, 'button')}>left-top</div>
        </Popover>
        <Popover
          content={`popover-left\npopover-left`}
          trigger={'hover'}
          placement={'left'}
        >
          <div className={classNames(css.button, 'button')}>left</div>
        </Popover>
        <Popover
          content={`popover-left-bottom\npopover-left-bottom`}
          trigger={'hover'}
          placement={'left-bottom'}
        >
          <div className={classNames(css.button, 'button')}>left-bottom</div>
        </Popover>
      </div>
    </>
  );
};

const map: { [key: string]: ReactNode } = {
  List: <ListGuide />,
  Toast: <ToastGuide />,
  Message: <MessageGuide />,
  Modal: <ModalGuide />,
  Drawer: <DrawerGuide />,
  Popover: <PopoverGuide />,
}