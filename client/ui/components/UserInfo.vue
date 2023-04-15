<template>
    <div>
        <div class="flex w-full justify-center lg:justify-normal">
            <div class="max-w-sm">
                <div class="bg-white shadow-xl rounded-lg py-3">
                    <div class="photo-wrapper p-2">
                        <img
                            class="w-32 h-32 rounded-full mx-auto"
                            src="data:image/png;base64,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"
                            alt="profile image"
                        />
                    </div>
                    <div class="p-2">
                        <h3
                            class="text-center text-xl text-gray-900 font-medium leading-8"
                        >
                            name
                        </h3>
                        <div
                            class="flex justify-center lg:justify-normal flex-row"
                        >
                            <div class="flex items-center flex-col mx-2">
                                <p>STAR</p>
                                <p>2</p>
                            </div>
                            <div class="flex items-center flex-col mx-2">
                                <p>ITEMS</p>
                                <p>14</p>
                            </div>
                            <div class="flex items-center flex-col mx-2">
                                <p>SOLD</p>
                                <p>2</p>
                            </div>
                            <div class="flex items-center flex-col mx-2">
                                <p>FT</p>
                                <p>1400</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts"></script>
