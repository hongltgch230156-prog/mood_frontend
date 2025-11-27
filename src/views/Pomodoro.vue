<template>
  <div class="ui container center aligned" style="margin-top: 50px;">
    
    <h2 class="ui header">
      <i class="hourglass half icon"></i> Focus Timer
      <div class="sub header">Stay focused for 25 minutes</div>
    </h2>

    <div class="timer-display">
      {{ formattedTime }}
    </div>

    <div class="timer-controls">
      <button v-if="!isRunning" class="ui big primary button" @click="startTimer">
        <i class="play icon"></i> Start Focus
      </button>
      <button v-else class="ui big red button" @click="pauseTimer">
        <i class="pause icon"></i> Pause
      </button>
      <button class="ui big basic button" @click="resetTimer">
        <i class="redo icon"></i> Reset
      </button>
    </div>

    <div v-if="showResultModal" class="ui dimmer visible active page">
      <div class="ui standard modal visible active scrolling" style="top: 100px; width: 500px; margin: auto;">
        <div class="header">
          🎉 Session Completed!
        </div>
        <div class="content left aligned">
          <div class="ui positive message">
            <div class="header">Great job!</div>
            <p>You just focused for 25 minutes. How do you feel right now?</p>
          </div>

          <form class="ui form">
            <div class="field">
              <label>Select Mood:</label>
              <!-- dùng select trực tiếp (không wrapper .selection.dropdown) -->
              <select v-model="moodEntry.mood" class="ui dropdown" @change="updateEmojiScore">
                <option disabled value="">Choose your mood...</option>
                <option v-for="m in moodList" :key="m" :value="m">{{ m }}</option>
              </select>
            </div>

            <div class="two fields">
              <div class="field emoji-picker">
                <label>Emoji</label>
                <div class="ui input" @click="toggleEmojiList">
                  <input type="text" v-model="moodEntry.emoji" readonly placeholder="Select emoji..." />
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

              <div class="field">
                <label>Score (1-10)</label>
                <select v-model="moodEntry.score" class="ui dropdown">
                  <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
                </select>
              </div>
            </div>

            <div class="field">
              <label>Note</label>
              <textarea v-model="moodEntry.note" rows="2"></textarea>
            </div>
          </form>


        </div>
        <div class="actions">
          <div class="ui black deny button" @click="closeModal">
            Discard (Don't Save)
          </div>
          <div class="ui positive right labeled icon button" @click="confirmSave">
            Save to Journal
            <i class="checkmark icon"></i>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from 'vue-router';
import { addNewMood } from "../helpers/api"; // Import hàm API thêm mood
import Swal from 'sweetalert2'; // Nếu bạn muốn thông báo đẹp

export default {
  name: "Pomodoro",
  setup() {
    // --- PHẦN TIMER ---
    const defaultTime = 3; // Demo: 60 giây (Thực tế là 25 * 60)
    const timeLeft = ref(defaultTime);
    const isRunning = ref(false);
    let timerInterval = null;
    const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");

    // Format giây thành mm:ss
    const formattedTime = computed(() => {
      const minutes = Math.floor(timeLeft.value / 60);
      const seconds = timeLeft.value % 60;
      return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    });

    const startTimer = () => {
      if (isRunning.value) return;
      isRunning.value = true;
      timerInterval = setInterval(() => {
        if (timeLeft.value > 0) {
          timeLeft.value--;
        } else {
          finishTimer();
        }
      }, 1000); // Mỗi giây giảm 1
    };

    const pauseTimer = () => {
      clearInterval(timerInterval);
      isRunning.value = false;
    };

    const resetTimer = () => {
      pauseTimer();
      timeLeft.value = defaultTime;
    };

    const finishTimer = () => {
      pauseTimer();
      audio.play(); // Kêu Ting!
      
      // Mở Modal và điền sẵn dữ liệu mặc định
      moodEntry.value.note = "🎯 Completed 1 Pomodoro Session (25 mins)";
      moodEntry.value.date = new Date().toISOString().split('T')[0]; // Lấy ngày hôm nay yyyy-MM-dd
      showResultModal.value = true;
    };

    // --- PHẦN MODAL & DATA ---
    const showEmojiList = ref(false);
    const emojiList = ["💪","😐","😄","😴","😫","😡","😔","🤩"];

    const toggleEmojiList = () => {
      showEmojiList.value = !showEmojiList.value;
    };

    const selectEmoji = (em) => {
      moodEntry.value.emoji = em;
      showEmojiList.value = false;
    };

    const showResultModal = ref(false);

    const moodEntry = ref({
      date: "",
      mood: "",
      emoji: "",
      score: null,
      note: "",
    });

    const moodList = [
      "Excellent",
      "Happy",
      "Motivated",
      "Neutral",
      "Stressed",
      "A bit sad",
      "Angry/Sad",
      "Tired",
    ];

    const moodMapping = {
      Excellent: { emoji: "🤩", score: 10 },
      Happy: { emoji: "😄", score: 9 },
      Motivated: { emoji: "💪", score: 8 },
      Neutral: { emoji: "😐", score: 5 },
      Stressed: { emoji: "😫", score: 4 },
      "A bit sad": { emoji: "😔", score: 3 },
      "Angry/Sad": { emoji: "😡", score: 2 },
      Tired: { emoji: "😴", score: 1 },
    };

    const updateEmojiScore = () => {
      const m = moodMapping[moodEntry.value.mood];
      if (m) {
        moodEntry.value.emoji = m.emoji;
        moodEntry.value.score = m.score;
      }
    };

    const closeModal = () => {
      showResultModal.value = false;
      resetTimer(); // Reset lại đồng hồ để chơi ván mới
    };

    const confirmSave = async () => {
      if (!moodEntry.value.mood) {
        Swal.fire("Please select a mood first!", "", "warning");
        return;
      }

      const result = await Swal.fire({
        title: "Save this mood?",
        text: "Do you want to save your focus session?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Save",
        cancelButtonText: "Don't Save",
      });

      if (result.isConfirmed) {
        saveSession();
      } else {
        closeModal();
      }
    };


    const saveSession = async () => {
      if (!moodEntry.value.mood) {
        Swal.fire("Please select a mood first!", "", "warning");
        return;
      }

      Swal.fire({
        title: 'Saving...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      try {
        console.log('Sending to API:', moodEntry.value);
        const resp = await addNewMood(moodEntry.value);
        Swal.close();

        console.log('API response:', resp);

        if (!resp) {
          await Swal.fire('Error', 'Server did not return success.', 'error');
          return;
        }

        await Swal.fire('Saved!', 'Your focus session has been logged.', 'success');
        closeModal();
      } catch (err) {
        Swal.close();
        console.error('saveSession error:', err);
        const msg = err?.response?.data?.error || err?.message || 'Unknown error';
        await Swal.fire('Error', `Failed to save mood: ${msg}`, 'error');
      }
    };

    return {
      timeLeft, 
      formattedTime, 
      isRunning,
      startTimer, 
      pauseTimer, 
      resetTimer,
      showEmojiList, 
      emojiList, 
      toggleEmojiList, 
      selectEmoji, 
      moodEntry, 
      moodList, 
      updateEmojiScore,
      closeModal, 
      saveSession,
      confirmSave,
      showResultModal,

    };
  }
};
</script>

<style scoped>
.timer-display {
  font-size: 80px;
  font-weight: bold;
  color: #2185d0;
  margin: 30px 0;
  font-family: 'Courier New', Courier, monospace; /* Font giống đồng hồ điện tử */
}
.timer-controls button {
  margin: 0 10px;
}

/* emoji picker */
.emoji-picker {
  position: relative;
  width: 100%;
}

.emoji-list {
  position: absolute;
  left: 0;
  top: calc(100% + 6px);
  z-index: 9999;                /* quan trọng để nổi lên trên modal */
  border: 1px solid #e6e6e6;
  background: #fff;
  padding: 8px;
  border-radius: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.08);
  width: 220px;                /* chỉnh rộng tùy ý */
  max-height: 160px;
  overflow-y: auto;
}

.emoji-item {
  font-size: 22px;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
}

.emoji-item:hover {
  transform: scale(1.2);
  background: #f4f4f4;
}

</style>