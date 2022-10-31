
import { getToken } from '../utils/utils';
import ZegoRoomkitSdk, {
    ZegoRoomkitJoinRoomConfig,
    setRoomParameterConfig,
    ZegoBeautifyMode,
    ZegoPreviewVideoMirrorMode,
    ZegoVideoFitMode
} from 'zego_roomkit_reactnative_sdk';

import { SecretID } from '../config';

export async function initRoomkit() {
    try {
        await ZegoRoomkitSdk.instance().getDeviceID();
    } catch (error) {
        console.log('mytag error', error)
        await ZegoRoomkitSdk.init({
            secretID: SecretID,
        });
    }
}

export async function joinRoom({ userID, roomID, pid, userName, role, subject = "", roomkitstate }: any) {

    console.log('mytag roomkitstate', roomkitstate)
    try {
        // setSpinner(true)
        // const { userID, roomID, pid, userName, role } = route.params;
        // 初始化

        callbackRegister();

        const roomService = ZegoRoomkitSdk.instance().inRoomService();
        const roomSetting = ZegoRoomkitSdk.instance().roomSettings();

        // avator config
        if (!roomkitstate.isAvatarHidden) {
            await roomService.setUserParameter({
                avatarUrl: 'https://gss3.bdstatic.com/84oSdTum2Q5BphGlnYG/timg?wapp&quality=80&size=b150_150&subsize=20480&cut_x=0&cut_w=0&cut_y=0&cut_h=0&sec=1369815402&srctrace&di=9f46b42f94ad866a87f516bccc32bbbc&wh_rate=null&src=http%3A%2F%2Fimgsrc.baidu.com%2Fforum%2Fpic%2Fitem%2Fb1f204d162d9f2d398ed608fa6ec8a136227ccdd.jpg',
                customIconUrl: 'https://gss3.bdstatic.com/84oSdTum2Q5BphGlnYG/timg?wapp&quality=80&size=b150_150&subsize=20480&cut_x=0&cut_w=0&cut_y=0&cut_h=0&sec=1369815402&srctrace&di=9f46b42f94ad866a87f516bccc32bbbc&wh_rate=null&src=http%3A%2F%2Fimgsrc.baidu.com%2Fforum%2Fpic%2Fitem%2Fb1f204d162d9f2d398ed608fa6ec8a136227ccdd.jpg',
            });
        }
        // UI config
        const { isBottomBarHiddenMode } = roomkitstate.roomUIConfig;
        await roomService.setUIConfig({
            ...roomkitstate.roomUIConfig,
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

        // ZegoRoomkitSdk.instance().setAdvancedConfig({
        //   domain: Domain,
        // });

        // setRoomParameter
        // const classDetail = await getClassDetail({ roomID, pid, userID });

        let roomParameter: setRoomParameterConfig = {
            beginTimestamp: new Date().getTime(),
            subject: subject
        };

        // let roomParameter = {
        //     subject: classDetail && classDetail.subject,
        //     beginTimestamp: new Date().getTime(),
        // } as setRoomParameterConfig;

        await roomService.setRoomParameter(roomParameter);

        // joinRoomWithConfig
        let deviceID = await ZegoRoomkitSdk.instance().getDeviceID();
        const token = await getToken(deviceID);
        let joinConfig = {
            userName,
            userID,
            roomID,
            productID: pid,
            role,
            token: token,
        } as unknown as ZegoRoomkitJoinRoomConfig;

        console.log('mytag before joinRoomWithConfig',)
        const joinRes = await roomService.joinRoomWithConfig(joinConfig);
        console.log('mytag joinRes', joinRes)
        console.log('mytag after joinRoomWithConfig',)

        // setSpinner(false)
        console.log('mytag done');
    } catch (error) {
        // setSpinner(false)
        console.log('mytag error in joinRoom', error);
    }
}

function callbackRegister() {
    ZegoRoomkitSdk.instance().on('inRoomEventNotify', function (event, roomId) {
        console.log('mytag event', event)
        console.log('mytag roomId', roomId)
    });
    ZegoRoomkitSdk.instance().on('memberJoinRoom', (args) => {
        console.log('mytag memberJoinRoom', args);
    });
    ZegoRoomkitSdk.instance().on('memberLeaveRoom', () => {
        console.log('mytag touch memberLeaveRoom');
    });

    ZegoRoomkitSdk.instance().on('buttonEvent', function () {
        console.log('mytag buttonEvent', arguments);
    });
}
