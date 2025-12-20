import { useVideoPlayer, VideoView } from 'expo-video';

interface VideoPlayerProps {
    video: string;
}

export function VideoPlayer({ video }: VideoPlayerProps) {
    const player = useVideoPlayer(video, player => {
        player.loop = true;
    });

    return (
        <VideoView style={{ width: '100%', height: 200 }} player={player} fullscreenOptions={{ enable: true }} allowsPictureInPicture />
    )
}