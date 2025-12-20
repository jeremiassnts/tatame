import { useVideoPlayer, VideoView } from 'expo-video';
import { Box } from '../ui/box';

interface VideoPlayerProps {
    video: string;
}

export function VideoPlayer({ video }: VideoPlayerProps) {
    const player = useVideoPlayer(video, player => {
        player.loop = true;
    });

    return (
        <Box className="w-full bg-neutral-800 rounded-md p-4">
            <VideoView style={{ width: '100%', height: 200 }} player={player} fullscreenOptions={{ enable: true }} allowsPictureInPicture />
        </Box>
    )
}