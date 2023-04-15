<template>
    <div class="flex flex-col max-w-full w-11/12 lg:w-3/4 mx-auto">
        <div class="mb-4">
            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="file_input">Upload file</label>
            <input type="file" ref="fileInput" @change="onFileChange" class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 p-2">
            <div class="mt-3 flex justify-center h-72">
                <img :src="imageDataUrl" class="w-auto h-auto max-w-full max-h-full">
            </div>
        </div>

        <div>
            <input
                type="text"
                id="first_name"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="title...."
                required
                v-model="title"
            />
        </div>
        <div class="my-2 flex flex-row justify-between">
            <div class="">
                <button
                    :class="[
                        activeChecker('bold') ? activeStyle : inactiveStyle,
                    ]"
                    @click="toggleBold()"
                >
                    <Icon name="fa6-solid:b" class="text-lg" />
                </button>
                <button
                    :class="[
                        activeChecker('bulletList')
                            ? activeStyle
                            : inactiveStyle,
                    ]"
                    @click="toggleBulletList()"
                >
                    <Icon name="uis:list-ul" class="text-lg" />
                </button>
                <button
                    @click="toggleHead()"
                    :class="[
                        activeChecker('heading') ? activeStyle : inactiveStyle,
                    ]"
                >
                    <Icon name="material-symbols:format-h1" class="text-lg" />
                </button>
                <button
                    @click="toggleStrike()"
                    :class="[
                        activeChecker('strike') ? activeStyle : inactiveStyle,
                    ]"
                >
                    <Icon
                        name="material-symbols:format-strikethrough-rounded"
                        class="text-lg"
                    />
                </button>
            </div>
            <button
                @click="save"
                class="bg-teal-500 text-white font-bold py-2 px-4 rounded"
            >
                save
            </button>
        </div>
        <editor-content :editor="editor" />
    </div>
</template>
<script setup lang="ts">
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Strike from "@tiptap/extension-strike";
import List from "@tiptap/extension-list-item";
import Heading from "@tiptap/extension-heading";
import axios from "axios";
import { getCurrentAddress } from "~/composables/metamask";

const imageDataUrl:Ref<any> = ref('')
const content: Ref<any> = ref("<p>Hello, World!</p>");
const title: Ref<string> = ref("");
const inactiveStyle: Ref<string> = ref(
    "bg-slate-200 hover:bg-slate-400 text-cyan-500 py-1 px-3 rounded-full m-0.5"
);
const activeStyle: Ref<string> = ref(
    "bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded-full m-0.5"
);

const editor: any = useEditor({
    content: content.value,
    extensions: [StarterKit, Bold, Strike, List, Heading],
    editorProps: {
        attributes: {
            class: "py-3 px-5 min-h-screen bg-slate-100",
        },
    },
});

const activeChecker = (extension: string): boolean => {
    if (!editor.value) {
        return false;
    }

    return editor.value.isActive(extension);
};

const toggleBold = () => {
    editor.value.chain().focus().toggleBold().run();
};

const toggleBulletList = () => {
    editor.value.chain().focus().toggleBulletList().run();
};
const toggleHead = () => {
    editor.value.chain().focus().toggleHeading({ level: 1 }).run();
};

const toggleStrike = () => {
    editor.value.chain().focus().toggleStrike().run();
};

const save = async () => {
    const data = {
        user_address: await getCurrentAddress(),
        thumbnail:imageDataUrl.value,
        title: title.value,
        content: editor.value.getHTML(),
    };
    await axios
        .post("http://localhost:8000/content/save", data)
        .then(function (response) {
            console.log(response.data.message);
            navigateTo({
                path:'/mypage',
                query: {
                    message: response.data.message,
                }
            });
        })
        .catch(function (error) {
            console.error(error.response.data.message);
            console.error(error);
            throw new Error(error);
        });
};

const onFileChange = (event:any) => {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        imageDataUrl.value = reader.result;
      };
};


</script>

<style scoped></style>
