import loadingIcon from "@/assets/loading.png";
import { classNames } from '@/utils/util';

/** loading 图标 */
const LoadingIcon: React.FC<{
  className?: string;
  size?: number;
}> = (props) => {
  return (
    <img
      className={classNames('loading-icon', props.className || '')}
      style={{ width: `${props.size}px` }}
      src={loadingIcon}
    ></img>
  );
};
export default LoadingIcon;