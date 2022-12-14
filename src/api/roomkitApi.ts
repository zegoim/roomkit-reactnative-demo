
import { getToken } from '../utils/utils';
import ZegoRoomkitSdk, {
    ZegoBeautifyMode,
    ZegoPreviewVideoMirrorMode,
    ZegoVideoFitMode,
    ZegoRoomEvent,
} from 'zego_roomkit_reactnative_sdk';
import Toast from 'react-native-toast-message';
import i18n from 'i18n-js';
import { SecretID } from '../config';

export async function initRoomkit() {
    try {
        await ZegoRoomkitSdk.instance().getDeviceID();
    } catch (error) {
        console.log('error in initRoomkit', error)
        await ZegoRoomkitSdk.init({
            secretID: SecretID,
        });
    }
}

export async function joinRoom({ userID, roomID, pid, userName, role, subject = "", roomkitstate }: any) {
    try {
        // 初始化
        callbackRegister();
        const roomService = ZegoRoomkitSdk.instance().inRoomService();
        const roomSetting = ZegoRoomkitSdk.instance().roomSettings();

        // avator config
        if (roomkitstate.isAvatarShow) {
            await roomService.setUserParameter({
                avatarUrl: 'https://gss3.bdstatic.com/84oSdTum2Q5BphGlnYG/timg?wapp&quality=80&size=b150_150&subsize=20480&cut_x=0&cut_w=0&cut_y=0&cut_h=0&sec=1369815402&srctrace&di=9f46b42f94ad866a87f516bccc32bbbc&wh_rate=null&src=http%3A%2F%2Fimgsrc.baidu.com%2Fforum%2Fpic%2Fitem%2Fb1f204d162d9f2d398ed608fa6ec8a136227ccdd.jpg',
                customIconUrl: 'https://gss3.bdstatic.com/84oSdTum2Q5BphGlnYG/timg?wapp&quality=80&size=b150_150&subsize=20480&cut_x=0&cut_w=0&cut_y=0&cut_h=0&sec=1369815402&srctrace&di=9f46b42f94ad866a87f516bccc32bbbc&wh_rate=null&src=http%3A%2F%2Fimgsrc.baidu.com%2Fforum%2Fpic%2Fitem%2Fb1f204d162d9f2d398ed608fa6ec8a136227ccdd.jpg',
            });
        }

        // UI config
        const { isMemberLeaveRoomMessageHidden, isBottomBarHiddenMode } = roomkitstate.roomUIConfig;
        await roomService.setUIConfig({
            ...roomkitstate.roomUIConfig,
            isMemberJoinRoomMessageHidden: isMemberLeaveRoomMessageHidden,
            isMinimizeHidden: true,
            bottomBarHiddenMode: !isBottomBarHiddenMode ? 0 : 1,
        });

        // room button config
        const {
            isMicrophoneOnWhenJoiningRoom,
            isCameraOnWhenJoiningRoom,
            beautifyMode,
            previewVideoMirrorMode,
            videoFitMode,
        } = roomkitstate.roomSettings;
        await roomSetting.setIsMicrophoneOnWhenJoiningRoom(isMicrophoneOnWhenJoiningRoom)
        await roomSetting.setIsCameraOnWhenJoiningRoom(isCameraOnWhenJoiningRoom)
        await roomSetting.setBeautifyMode(beautifyMode ? ZegoBeautifyMode.ZegoBeautifyMedium : ZegoBeautifyMode.ZegoBeautifyNone)
        await roomSetting.setPreviewVideoMirrorMode(previewVideoMirrorMode ? ZegoPreviewVideoMirrorMode.ZegoPreviewVideoMirrorModeLeftRightSwap : ZegoPreviewVideoMirrorMode.ZegoPreviewVideoMirrorModeNone)
        await roomSetting.setVideoFitMode(videoFitMode ? ZegoVideoFitMode.ZegoVideoFill : ZegoVideoFitMode.ZegoVideoAspectFit)

        let roomParameter = {
            beginTimestamp: new Date().getTime(),
            duration: 30,
            subject: subject,
            hostNickname: 'hostName',
        };
        await roomService.setRoomParameter(roomParameter);

        // joinRoomWithConfig
        let deviceID = await ZegoRoomkitSdk.instance().getDeviceID();
        const token = await getToken(deviceID);
        let joinConfig = {
            userID,
            // 用户名称（必填）。
            userName,
            // 房间 ID（必填）。
            roomID,
            // 房间的 ProductID（必填）。
            // 从 RoomKit 管理后台获取。
            productID: pid,
            // 用户角色，有老师、学生、助教三种（必填）。
            // 1：老师
            // 2：学生
            // 4：助教
            role,
            // 通过调用 RoomKit REST API “get_sdk_token” 获取 （必填）。
            token,
            kZegoRPAppGroup: "group.im.zego.RoomKitRNDemo",
            kAppExtensionBundleID: "im.zego.RoomKitRNDemo.roomkit-reactnative-demo-screen-share"
        };

        const joinRes = await roomService.joinRoomWithConfig(joinConfig);
        if (joinRes && !!joinRes.errorCode) {
            throw new Error(JSON.stringify(joinRes))
        }
        // setSpinner(false)
        console.log('done');
    } catch (error) {
        Toast.show({ text1: i18n.t('roomkit_room_join_failed'), type: 'error' });
        console.log('error in joinRoom', error);
        return error
    }
}


export async function getDeviceID() {
    let deviceID = await ZegoRoomkitSdk.instance().getDeviceID();
    return deviceID
}

export async function getVersion() {
    return await ZegoRoomkitSdk.instance().getVersion()
}

function callbackRegister() {
    ZegoRoomkitSdk.instance().off('inRoomEventNotify')
    ZegoRoomkitSdk.instance().off('memberJoinRoom')
    ZegoRoomkitSdk.instance().off('memberLeaveRoom')
    ZegoRoomkitSdk.instance().off('buttonEvent')

    ZegoRoomkitSdk.instance().on('inRoomEventNotify', function (event, roomId) {
        if (event === ZegoRoomEvent.ZegoRoomEventMemberKickedOut) {
            Toast.show({ text1: i18n.t('roomkit_room_kickout'), type: 'error' });
        }
    });
    ZegoRoomkitSdk.instance().on('memberJoinRoom', (args) => {
        console.log('roomkit callback memberJoinRoom', args);
    });
    ZegoRoomkitSdk.instance().on('memberLeaveRoom', () => {
        console.log('roomkit callback touch memberLeaveRoom');
    });

    ZegoRoomkitSdk.instance().on('buttonEvent', function () {
        console.log('roomkit callback buttonEvent', arguments);
    });
}
