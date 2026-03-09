import { Progress } from "@/components/animate-ui/components/radix/progress";
import {ProgressIndicator} from "@radix-ui/react-progress";

export default function Loading() {
    return (
        <div className="flex items-center justify-center h-screen w-screen px-[33%]">
            <Progress>
                <ProgressIndicator/>
            </Progress>
        </div>
    );
}