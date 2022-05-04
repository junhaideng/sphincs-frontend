<template>
  <a-card class="container">
    <a-row>
      <a-col :span="20" :offset="2">
        <a-form :labelCol="{ span: 4 }">
          <a-form-item>
              <a-row>
                <a-col :span="20" :offset="4">
                  <a-alert
                    message="参数均采用 SPHINCS-256 中使用的参数: τ=16, w=4, k=32, n=256, m=512, h=60, d=12"
                    type="info"
                  />
                </a-col>
              </a-row>
            </a-form-item>
          <a-form-item label="消息">
            <a-input v-model:value="msg"></a-input>
          </a-form-item>

          <a-form-item label="签名算法">
            <a-select
              v-model:value="algorithm"
              placeholder="请选择一个签名算法"
            >
              <a-select-option
                v-for="alg in algorithm_list"
                :key="alg"
                :value="alg"
                >{{ alg }}</a-select-option
              >
            </a-select>
          </a-form-item>
          <a-form-item :wrapperCol="{ offset: 4 }">
            <a-button type="primary" @click="handleClick"> 运行 </a-button>
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>
    <a-divider></a-divider>
    <!-- <a-row>
      <a-col :span="17" :offset="5">
        <a-alert
          message="16进制表示, 每两个字符表示占一个字节的空间"
          type="info"
        />
      </a-col>
    </a-row> -->
    <a-spin :spinning="spinning">
      <a-row>
        <a-col :span="20" :offset="2">
          <a-form :labelCol="{ span: 4 }">
            <a-form-item>
              <a-row>
                <a-col :span="20" :offset="4">
                  <a-alert
                    message="16 进制表示, 每两个字符表示占一个字节的空间"
                    type="info"
                  />
                </a-col>
              </a-row>
            </a-form-item>

            <a-form-item label="私钥">
              <a-textarea
                v-model:value="sk"
                :show-count="sk.length != 0"
                :auto-size="{ minRows: 2, maxRows: 5 }"
                :disabled="false"
              >
              </a-textarea>
            </a-form-item>
            <a-form-item label="公钥">
              <a-textarea
                v-model:value="pk"
                :show-count="pk.length != 0"
                :auto-size="{ minRows: 2, maxRows: 5 }"
                :disabled="false"
              ></a-textarea>
            </a-form-item>
            <a-form-item label="签名">
              <a-textarea
                v-model:value="signature"
                :show-count="signature.length != 0"
                :auto-size="{ minRows: 2, maxRows: 5 }"
                :disabled="false"
              ></a-textarea>
            </a-form-item>
            <a-form-item label="耗时">
              <template v-if="show">
                <a-descriptions style="margin-top: 4px">
                  <a-descriptions-item label="密钥生成">{{
                   cost && cost.gen
                  }}</a-descriptions-item>
                  <a-descriptions-item label="消息签名">{{
                    cost && cost.sign
                  }}</a-descriptions-item>
                  <a-descriptions-item label="签名校验">{{
                    cost && cost.verify
                  }}</a-descriptions-item>
                </a-descriptions>
              </template>
            </a-form-item>
          </a-form>
        </a-col>
      </a-row>
    </a-spin>
  </a-card>
</template>

<script lang="ts">
import { message } from "ant-design-vue";
import { defineComponent, onMounted, reactive, ref } from "vue";
import { getSinagure, getSinagureAlorightmList, Cost } from "../api/signature";

export default defineComponent({
  setup() {
    let algorithm_list = ref<Array<string>>([]);
    let algorithm = ref<string>("");
    const msg = ref<string>("hello");

    const sk = ref<string>("");
    const pk = ref<string>("");
    const signature = ref<string>("");
    const cost = ref<Cost>();

    onMounted(() => {
      getSinagureAlorightmList().then((res) => {
        algorithm_list.value = res.data.data;
        if (algorithm_list.value.length > 0) {
          algorithm.value = algorithm_list.value[0];
        } else {
          message.error("暂不支持任何签名算法");
        }
      });
    });

    const spinning = ref<boolean>(false);
    const show = ref(false);
    return {
      algorithm_list,
      algorithm,
      msg,
      sk,
      pk,
      signature,
      cost,
      spinning,
      show,
    };
  },
  methods: {
    // 动态获取 algorithm 列表

    handleClick() {
      this.spinning = true;
      getSinagure(this.msg, this.algorithm)
        .then((res) => {
          if (res.data.code != 0) {
            message.error(res.data.message);
            return;
          }
          console.log(res.data);
          const { sk, pk, sigma, cost } = res.data.data;
          this.sk = sk;
          this.pk = pk;
          this.signature = sigma;
          this.cost = cost;
          this.show = true;

          message.success("success");
        })
        .catch((err) => {
          message.error(err.msg);
        })
        .finally(() => {
          this.spinning = false;
        });
    },
  },
});
</script>

<style scoped>
.container {
  width: 1000px;
  margin:  auto;
}
</style>