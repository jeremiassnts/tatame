import { useRoles } from '@/src/api/use-roles';
import { queryClient } from '@/src/lib/react-query';
import { UseMutationResult } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Badge, BadgeIcon, BadgeText } from '../ui/badge';
import { Button, ButtonIcon, ButtonSpinner, ButtonText } from '../ui/button';
import { Card } from "../ui/card";
import { Heading } from '../ui/heading';
import { HStack } from "../ui/hstack";
import { CalendarDaysIcon, ClockIcon, TrashIcon } from '../ui/icon';
import { VStack } from '../ui/vstack';

interface VideoRowProps {
    id: number
    video: string
    createdAt: string
    title: string
    onDelete: UseMutationResult<null, Error, number, unknown>
}

export function VideoRow({ id, video, createdAt, title, onDelete }: VideoRowProps) {
    const player = useVideoPlayer(video, player => {
        player.loop = true;
    });
    const { getRole } = useRoles()
    const { data: role } = getRole
    const { mutateAsync: deleteAssetFn, isPending: isDeletingAsset } = onDelete;

    async function handleDeleteAsset() {
        await deleteAssetFn(id)
        queryClient.invalidateQueries({ queryKey: ["videos"] });
    }

    function formatDuration(duration: number) {
        const aux = Math.floor(duration);
        const minutes = Math.floor(aux / 60);
        const seconds = aux % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    return (
        <Card className="w-full bg-neutral-800 rounded-md p-4">
            <HStack className='justify-start gap-4'>
                <VideoView style={{ width: 175, height: '100%', minHeight: 120, zIndex: 1000 }}
                    player={player}
                    fullscreenOptions={{ enable: true }}
                    allowsPictureInPicture
                />
                <VStack className='gap-1 items-start justify-start flex-wrap w-full relative'>
                    <Heading size="md" className="text-neutral-200">{title}</Heading>
                    <Badge size='lg' className='gap-2'>
                        <BadgeIcon as={ClockIcon} />
                        <BadgeText>{formatDuration(player.duration)}</BadgeText>
                    </Badge>
                    <Badge size='lg' className='gap-2'>
                        <BadgeIcon as={CalendarDaysIcon} />
                        <BadgeText>{format(new Date(createdAt), 'dd/MM/yyyy')}</BadgeText>
                    </Badge>
                    {role === 'MANAGER' &&
                        <Button className='mt-auto px-2 py-1'
                            size='xs'
                            variant='outline'
                            onPress={handleDeleteAsset}
                            disabled={isDeletingAsset}>
                            {isDeletingAsset ? <ButtonSpinner /> : <ButtonIcon as={TrashIcon} size='xs' />}
                            {!isDeletingAsset && <ButtonText>Excluir</ButtonText>}
                        </Button>}
                </VStack>
            </HStack>
        </Card>
    );
}