<template>
    <div class="ui container improved-view">
        <h2 class="ui dividing header centered-text">
            Mood Detail 📝
        </h2>

        <div class="ui segment raised stacked">
            
            <div class="ui form">
                <div class="field">
                    <label class="detail-label">
                        <i class="calendar alternate outline icon"></i> Date
                    </label>
                    <input type="text" disabled :value="mood.date" class="read-only-input"/>
                </div>

                <div class="field">
                    <label class="detail-label">
                        <i class="smile outline icon"></i> Mood
                    </label>
                    <input type="text" disabled :value="mood.mood" class="read-only-input"/>
                </div>
                
                <div class="field">
                    <label class="detail-label">
                        <i class="heart outline icon"></i> Emoji
                    </label>
                    <input type="text" disabled :value="mood.emoji" class="read-only-input large-emoji"/>
                </div>

                <div class="field">
                    <label class="detail-label">
                        <i class="star outline icon"></i> Score
                    </label>
                    <input type="text" disabled :value="mood.score" class="read-only-input"/>
                </div>
                
                <div class="field">
                    <label class="detail-label">
                        <i class="sticky note outline icon"></i> Note
                    </label>
                    <textarea disabled rows="3" :value="mood.note" class="read-only-input"></textarea>
                </div>
            </div>

            <div class="ui divider"></div>

            <div class="actions">
                <router-link to="/moods" class="ui button large">
                    <i class="arrow left icon"></i> Back
                </router-link>
                <router-link :to="{ name: 'EditMood', params: { id: route.params.id } }" class="ui yellow button large">
                    <i class="edit icon"></i> Edit Mood
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>

import {ref,onMounted} from 'vue';
import {useRoute} from 'vue-router';
import {viewMoodById} from '../helpers/api.js';

export default {
    name: "ViewMood",
    setup() {
        const mood = ref({}); 
        const route = useRoute();

        onMounted(async () => {
            mood.value = await viewMoodById(route.params.id) || {};

            if (mood.value.date) {
                mood.value.date = mood.value.date.split('T')[0]; // chỉ lấy yyyy-MM-dd
            }
        });

        return {
            mood, 
            route
        };
    }
};
</script>

<style scoped>
.improved-view {
    width: 80%;
    max-width: 800px;
    margin: 0 auto;
    padding: 40px;
    display: flex;
    flex-direction: column;
    justify-content: right;
}

.centered-text {
    text-align: center;
    margin-bottom: 30px !important;
    font-size: 2em;
    color: #5d5d5d;
}

.ui.segment.raised.stacked {
    /* Tạo hiệu ứng sâu hơn cho Card */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 30px;
    border-radius: 8px;
}

.detail-label {
    /* Định dạng Label */
    font-weight: bold !important;
    color: #4a4a4a !important;
    font-size: 1.1em;
    margin-bottom: 5px !important;
    display: block; /* Đảm bảo label chiếm dòng riêng */
}

.read-only-input,
textarea.read-only-input {
    /* Định dạng các trường input/textarea chỉ đọc */
    background-color: #f9f9f9 !important;
    border: 1px solid #e0e0e0 !important;
    color: #2c3e50 !important;
    font-size: 1em !important;
    padding: 12px !important;
    cursor: default !important; /* Dấu hiệu là không thể chỉnh sửa */
}

.large-emoji {
    font-size: 1.5em !important; 
}

.actions {
    text-align: right;
    padding-top: 15px;
}

/* Tùy chỉnh Icon */
.ui.form .field > label i.icon {
    margin-right: 5px;
    color: #fbbd08;
}

.ui.container.improved-view {
    display: flex;
    flex-direction: column;
    justify-content: right;
}

</style>