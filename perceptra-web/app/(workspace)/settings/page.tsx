import {NotificationPreferences} from '../../../components/notification-preferences';
import {Heading} from '../../../components/workspace';import {CameraSettings} from '../../../components/camera-settings';
import {Operators} from '../../../components/operators';
export default function Settings(){return <><Heading title="Station settings" description="Persistent camera capture and monitoring configuration."/><CameraSettings/><NotificationPreferences/><Operators/></>}
