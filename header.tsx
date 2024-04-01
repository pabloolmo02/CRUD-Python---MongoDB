import { component$ } from '@builder.io/qwik';

export const Header = component$(() => {
    return (
        <header class="text-center py-8 ">
        <h1 class="text-4xl font-bold text-djset-800">
            DEEJAY SET
        </h1>
        <h2 class="text-2xl text-djset -400">
            OlmoDJ
        </h2>
        </header>
    )
});