<script>
import { ref, onMounted } from "vue";
import { viewAllMoods, deleteMoodById, deleteAllMoods} from "../helpers/api";
import Swal from 'sweetalert2';

export default {
  name: "MoodList",
  setup() {
    const moods = ref([]);
    const page = ref(1);
    const limit = ref(8); // số mood mỗi trang
    const totalPages = ref(1);

    const loadMoods = async () => {
      const res = await viewAllMoods(page.value, limit.value); // sửa api gọi phân trang
      if(res && res.data){
        moods.value = res.data.map(m => {
          if(m.date) m.date = m.date.split('T')[0];
          return m;
        });
        totalPages.value = res.totalPages;
      } else {
        moods.value = [];
        totalPages.value = 1;
      }
    };

    onMounted(loadMoods);


      const onDelete = async (id) => {
        const result = await Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!"
        });

        if (result.isConfirmed) {
          try {
            await deleteMoodById(id); // gọi API xóa
            await loadMoods(); // load lại danh sách sau khi xóa
            await Swal.fire({
              title: "Deleted!",
              text: "The mood has been deleted.",
              icon: "success"
            });
          } catch (err) {
            await Swal.fire({
              title: "Error!",
              text: "Something went wrong",
              icon: "error"
            });
            console.error(err);
          }
        }
      };

    const onDeleteMany = async (id) => {
          const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete all!"
          });

          if (result.isConfirmed) {
            try {
              await deleteAllMoods(); // gọi API xóa tất cả
              moods.value = []; // cập nhật UI
              await Swal.fire({
                title: "Deleted!",
                text: "All moods have been deleted.",
                icon: "success"
              });
            } catch (err) {
              await Swal.fire({
                title: "Error!",
                text: "Something went wrong",
                icon: "error"
              });
              console.error(err);
            }
          }
        };

    const prevPage = () => {
      if (page.value > 1) {
        page.value--;
        loadMoods();
      }
    };

    const nextPage = () => {
      if (page.value < totalPages.value) {
        page.value++;
        loadMoods();
      }
    };

    return { 
      moods, 
      onDelete, 
      page, 
      totalPages, 
      prevPage, 
      nextPage,
      onDeleteMany, 
    };
  },
};
</script>

<template>
  <div class="ui container main-content">
    <h1>Mood List</h1>
    <table class="ui celled compact table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Mood</th>
          <th>Emoji</th>
          <th>Score</th>
          <th>Note</th>
          <th colspan="3">Menu</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(mood, index) in moods" :key="index">
          <td>{{mood.date}}</td>
          <td>{{mood.mood}}</td>
          <td>{{mood.emoji}}</td>
          <td>{{mood.score}}</td>
          <td>{{mood.note}}</td>
          <td><router-link class="ui button green" :to="{name:'ViewMood', params:{id: mood._id}}">Show</router-link></td>
          <td><router-link class="ui button yellow" :to="{name:'EditMood', params:{id: mood._id}}">Edit</router-link></td>
          <td><a class="ui red button" @click.prevent="onDelete(mood._id)">Delete</a></td>
        </tr>
      </tbody>
    </table>

    <div class="ui buttons" style="margin-top:20px;">
      <button class="ui button" :disabled="page === 1" @click="prevPage">Prev</button>
      <button class="ui button disabled">{{ page }} / {{ totalPages }}</button>
      <button class="ui button" :disabled="page === totalPages" @click="nextPage">Next</button>
    </div>

    <!-- nút Delete All  -->
  <button class="ui red button" @click="onDeleteMany">Delete All</button>
  </div>
</template>
