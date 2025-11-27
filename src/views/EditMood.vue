<script>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { viewMoodById, editMood } from '../helpers/api.js';
import Swal from 'sweetalert2';

export default {
    name: "EditMood",
    setup() {
        const mood = ref({
            date: "",
            mood: "",
            emoji: "",
            score: null,
            note: ""
        });
        const route = useRoute();
        const router = useRouter();

        // Mood list
        const moodList = [
            'Excellent', 'Happy', 'Motivated', 'Neutral',
            'Stressed', 'A bit sad', 'Angry/Sad', 'Tired'
        ];

        // Mapping mood -> emoji + score
        const moodMapping = {
            "Excellent": { emoji: "🤩", score: 10 },
            "Happy": { emoji: "😄", score: 9 },
            "Motivated": { emoji: "💪", score: 8 },
            "Neutral": { emoji: "😐", score: 5 },
            "Stressed": { emoji: "😫", score: 4 },
            "A bit sad": { emoji: "😔", score: 3 },
            "Angry/Sad": { emoji: "😡", score: 2 },
            "Tired": { emoji: "😴", score: 1 },
        };

        // Emoji picker
        const showEmojiList = ref(false);
        const emojiList = [
            "💪","😐","😄","😴","😫","😡","😔","🤩"
        ];

        const toggleEmojiList = () => {
            showEmojiList.value = !showEmojiList.value;
        };

        const selectEmoji = (em) => {
            mood.value.emoji = em;
            showEmojiList.value = false;
        };

        watch (
            () =>mood.value.mood,
            (newMood) => {
                if (moodMapping[newMood]) {
                    mood.value.emoji = moodMapping[newMood].emoji;
                    mood.value.score = moodMapping[newMood].score;
                }
            }
        );

        onMounted(async () => {
            const result = await viewMoodById(route.params.id);
            if (!result) {
                alert("Mood not found!");
                return;
            }
            if (result.date) {
                result.date = result.date.split('T')[0]; // chỉ lấy yyyy-MM-dd
            }
            Object.assign(mood.value, result); // copy dữ liệu vào object reactive sẵn
        });

        const updateMood = async () => {
            try {
                const result = await editMood(route.params.id, mood.value);
                
                if (result) {
                    await Swal.fire({
                        title: 'Updated!',
                        text: 'Your mood has been updated successfully!',
                        icon: 'success',
                        timer: 1500, 
                        showConfirmButton: false
                    });
                    
                    router.push("/moods");
                } else {
                    Swal.fire("Error", "Failed to update mood!", "error");
                }
            } catch (error) {
                console.error(error);
                Swal.fire("Error", "Something went wrong!", "error");
            }
        };

        return {
            mood,
            route,
            updateMood,
            moodList,
            showEmojiList,
            emojiList,
            toggleEmojiList,
            selectEmoji,
            
        };
    }
};
</script>


<template>
    <div class="ui container improved-view">
        <h2 class="ui dividing header centered-text">
            Edit Mood ✏️
        </h2>

        <div class="ui segment raised stacked">
            <form class="ui form" @submit.prevent="updateMood"> 
                
                <!-- DATE -->
                <div class="field">
                    <label class="detail-label"><i class="calendar alternate outline icon"></i> Date</label>
                    <input type="date" v-model="mood.date" required/> 
                </div>

                <!-- MOOD DROPDOWN -->
                <div class="field">
                    <label class="detail-label"><i class="smile outline icon"></i> Mood</label>
                    <select v-model="mood.mood" class="ui dropdown">
                        <option disabled value="">Select mood...</option>
                        <option 
                            v-for="(m, idx) in moodList" 
                            :key="idx" 
                            :value="m"
                        >
                            {{ m }}
                        </option>
                    </select>
                </div>

                <!-- EMOJI PICKER -->
                <div class="field emoji-picker">
                    <label class="detail-label"><i class="heart outline icon"></i> Emoji</label>

                    <div class="ui input" @click="toggleEmojiList">
                        <input 
                            type="text" 
                            v-model="mood.emoji" 
                            readonly 
                            placeholder="Select emoji..."
                        />
                    </div>

                    <div class="emoji-list" v-if="showEmojiList">
                        <span 
                            v-for="(em, idx) in emojiList" 
                            :key="idx" 
                            class="emoji-item"
                            @click="selectEmoji(em)"
                        >
                            {{ em }}
                        </span>
                    </div>
                </div>

                <!-- SCORE SELECT -->
                <div class="field">
                    <label class="detail-label"><i class="star outline icon"></i> Score</label>
                    <select v-model="mood.score" class="ui dropdown">
                        <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
                    </select>
                </div>
                
                <!-- NOTE -->
                <div class="field">
                    <label class="detail-label"><i class="sticky note outline icon"></i> Note</label>
                    <textarea rows="3" v-model="mood.note"></textarea>
                </div>

                <div class="ui divider"></div>

                <div class="actions centered-actions">
                    <button type="submit" class="ui green button large">
                        <i class="save icon"></i> Save Changes
                    </button>
                    <router-link to="/moods" class="ui button large">
                        Cancel
                    </router-link>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped>
/* 1. Căn chỉnh khung form cho nhỏ lại */
.improved-view {
  max-width: 600px !important; /* Giới hạn chiều ngang chỉ 600px */
  margin-top: 50px; /* Cách lề trên */
  
  /* Căn giữa màn hình */
  margin-left: auto !important; 
  margin-right: auto !important;
}

/* 2. Trang trí tiêu đề form */
.centered-text {
  text-align: center;
  color: #2185d0; /* Màu xanh của Semantic UI */
  margin-bottom: 25px;
}

/* 3. CSS cho EMOJI PICKER (Để các icon xếp đẹp) */
.emoji-picker {
  position: relative; /* Để danh sách emoji hiện ngay bên dưới */
}

.emoji-list {
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  margin-top: 5px;
  background: white;
  display: flex;
  flex-wrap: wrap; /* Tự động xuống dòng nếu hết chỗ */
  justify-content: center;
  gap: 10px; /* Khoảng cách giữa các emoji */
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.emoji-item {
  font-size: 24px;
  cursor: pointer;
  transition: transform 0.2s;
  padding: 5px;
  border-radius: 5px;
}

.emoji-item:hover {
  transform: scale(1.2); /* Phóng to nhẹ khi di chuột vào */
  background-color: #f0f0f0;
}

/* 4. Căn giữa các nút bấm bên dưới */
.centered-actions {
  display: flex;
  justify-content: center;
  gap: 15px; /* Khoảng cách giữa 2 nút */
}
</style>