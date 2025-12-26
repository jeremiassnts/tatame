import { Box } from "../ui/box";
import { Text } from "../ui/text";
import { Textarea, TextareaInput } from "../ui/textarea";

interface TextAreaInputProps {
    placeholder: string;
    onChangeText: (text: string) => void;
    value: string;
    error?: string;
}

export default function TextAreaInput({ placeholder, onChangeText, value, error }: TextAreaInputProps) {
    return (
        <Box>
            <Textarea className="bg-neutral-800 rounded-md border-0 px-2 text-white">
                <TextareaInput placeholder={placeholder} value={value} onChangeText={onChangeText} />
            </Textarea>
            {error && <Text className="text-red-500 text-sm mt-2">{error}</Text>}
        </Box>
    )
}