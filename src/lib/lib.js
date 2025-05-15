import { FaPhotoVideo, FaRegSmile } from "react-icons/fa";
import { FaVideo } from "react-icons/fa6";
import { Unfollow } from "../utils/actions.utils";

export const _ = {};

_.postCreationIconsAndLabels = [
  {
    label: "Go Live",
    colorClass: 'text-red-400',
    icon: FaVideo
  },
  {
    label: "Add Photos/Video",
    colorClass: 'text-green-400',
    icon: FaPhotoVideo
  },
  {
    label: "Add Story",
    colorClass: 'text-orange-300',
    icon: FaRegSmile
  },
]

_.postCardActions = [
  {
    label: 'Unfollow',
    colorClass: 'text-red-500',
  },
  {
    label: 'Save Post',
  },
  {
    label: 'Go to Post',
  },
  {
    label: 'Share'
  },
  {
    label: 'About this account'
  },
  {
    label: 'Close'
  },
]