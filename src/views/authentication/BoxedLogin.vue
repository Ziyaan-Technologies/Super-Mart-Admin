<script setup lang="ts">
import LoginForm from '@/components/auth/LoginForm.vue';
import logo from '@/assets/images/logos/ziyaan-logo.png';

const year = new Date().getFullYear();
</script>

<template>
  <div class="zt-login">
    <!-- left: the brand -->
    <aside class="zt-brandside">
      <div class="zt-floor"></div>
      <div class="zt-horizon"></div>
      <div class="zt-rings">
        <span class="zt-ring zt-ring--1"></span>
        <span class="zt-ring zt-ring--2"></span>
        <span class="zt-ring zt-ring--3"></span>
      </div>
      <div class="zt-scan"></div>
      <div class="zt-sparks">
        <i style="--x: 12%; --y: 22%; --d: 0s"></i>
        <i style="--x: 78%; --y: 16%; --d: 1.2s"></i>
        <i style="--x: 64%; --y: 68%; --d: 2.1s"></i>
        <i style="--x: 28%; --y: 80%; --d: 3.4s"></i>
        <i style="--x: 88%; --y: 47%; --d: 4.1s"></i>
      </div>

      <header class="zt-mark">
        <span class="zt-mark__halo"><img :src="logo" alt="Ziyaan Technologies" /></span>
        <div>
          <div class="zt-mark__name">Ziyaan Technologies</div>
          <div class="zt-mark__meta">Software House · Est. 2024</div>
        </div>
      </header>

      <div class="zt-statement">
        <div class="zt-rule"></div>
        <h1>Crafting<br />Digital Excellence</h1>
        <p>
          The control room for every business on the platform — their shops, catalogue,
          counters and people, in one place.
        </p>
        <div class="zt-chips">
          <span><i></i>Systems online</span>
          <span><i></i>Encrypted session</span>
        </div>
      </div>

      <footer class="zt-foot">
        <span>Quetta · Pakistan</span>
        <span>ziyaantechnologies.com</span>
      </footer>
    </aside>

    <!-- right: the form -->
    <main class="zt-formside">
      <div class="zt-formside__grid"></div>
      <div class="zt-formside__glow"></div>
      <div class="zt-formside__edge"></div>

      <div class="zt-form">
        <span class="zt-corner zt-corner--tl"></span>
        <span class="zt-corner zt-corner--br"></span>
        <img :src="logo" alt="Ziyaan Technologies" class="zt-form__mark" />
        <h2 class="zt-form__title">Sign in</h2>
        <p class="zt-form__text">Welcome back. Use your admin account.</p>

        <LoginForm />

        <p class="zt-form__foot">© {{ year }} Ziyaan Technologies</p>
      </div>
    </main>
  </div>
</template>

<style scoped lang="scss">
.zt-login {
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  min-height: 100vh;
  background: #ffffff;
}

/* ---------- brand side ---------- */
.zt-brandside {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 56px 64px;
  overflow: hidden;
  color: #e8f1ff;
  background: linear-gradient(155deg, #091026 0%, #050810 45%, #060d1f 100%);
}

/* perspective grid floor */
.zt-floor {
  position: absolute;
  left: -30%;
  right: -30%;
  bottom: 0;
  height: 70%;
  background-image:
    linear-gradient(rgba(56, 189, 248, 0.5) 1px, transparent 1px),
    linear-gradient(90deg, rgba(56, 189, 248, 0.38) 1px, transparent 1px);
  background-size: 58px 58px;
  transform: perspective(620px) rotateX(70deg);
  transform-origin: bottom center;
  mask-image: linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.5) 45%, transparent 88%);
  -webkit-mask-image: linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.5) 45%, transparent 88%);
  animation: zt-drift 12s linear infinite;
}

@keyframes zt-drift {
  to {
    background-position: 0 58px;
  }
}

/* a glow where the grid meets the horizon */
.zt-horizon {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 34%;
  height: 160px;
  background: radial-gradient(ellipse at center bottom, rgba(34, 211, 238, 0.22), transparent 70%);
  pointer-events: none;
}

/* orbit rings behind the statement */
.zt-rings {
  position: absolute;
  top: 46%;
  right: -14%;
  width: 640px;
  height: 640px;
  transform: translateY(-50%);
  pointer-events: none;
}

.zt-ring {
  position: absolute;
  inset: 0;
  margin: auto;
  border-radius: 50%;
  border: 1px solid rgba(125, 211, 252, 0.16);
}

.zt-ring--1 {
  width: 100%;
  height: 100%;
  border-color: rgba(125, 211, 252, 0.1);
}

.zt-ring--2 {
  width: 72%;
  height: 72%;
  border-style: dashed;
  border-color: rgba(125, 211, 252, 0.16);
  animation: zt-spin 46s linear infinite;
}

.zt-ring--3 {
  width: 44%;
  height: 44%;
  border-color: rgba(34, 211, 238, 0.35);
  background: radial-gradient(circle at 35% 30%, rgba(34, 211, 238, 0.18), rgba(37, 99, 235, 0.08) 45%, transparent 68%);
  box-shadow: 0 0 80px rgba(6, 182, 212, 0.22), 0 0 30px rgba(34, 211, 238, 0.25) inset;
  animation: zt-breathe 7s ease-in-out infinite;
}

@keyframes zt-breathe {
  0%, 100% {
    transform: scale(1);
    opacity: 0.85;
  }
  50% {
    transform: scale(1.06);
    opacity: 1;
  }
}

@keyframes zt-spin {
  to {
    transform: rotate(360deg);
  }
}

/* a slow light sweep */
.zt-scan {
  position: absolute;
  top: -40%;
  left: -60%;
  width: 55%;
  height: 190%;
  background: linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.12), transparent);
  transform: rotate(18deg);
  animation: zt-sweep 9s ease-in-out infinite;
}

@keyframes zt-sweep {
  0%, 100% {
    transform: translateX(0) rotate(18deg);
    opacity: 0;
  }
  45% {
    opacity: 1;
  }
  100% {
    transform: translateX(320%) rotate(18deg);
  }
}

/* drifting points of light */
.zt-sparks i {
  position: absolute;
  left: var(--x);
  top: var(--y);
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #67e8f9;
  box-shadow: 0 0 12px rgba(103, 232, 249, 0.9);
  opacity: 0;
  animation: zt-blink 6s ease-in-out infinite;
  animation-delay: var(--d);
}

@keyframes zt-blink {
  0%, 100% {
    opacity: 0;
    transform: translateY(6px);
  }
  50% {
    opacity: 0.85;
    transform: translateY(-6px);
  }
}

.zt-mark {
  position: relative;
  display: flex;
  align-items: center;
  gap: 14px;
}

.zt-mark__halo {
  position: relative;
  display: inline-flex;
  padding: 3px;
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(34, 211, 238, 0.7), rgba(59, 130, 246, 0.35), transparent 70%);
  box-shadow: 0 0 34px rgba(6, 182, 212, 0.35);
}

.zt-mark img {
  width: 52px;
  height: 52px;
  border-radius: 15px;
  display: block;
}

.zt-mark__name {
  font-family: 'Outfit', sans-serif;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 0.01em;
  color: #ffffff;
}

.zt-mark__meta {
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #7f93ad;
  margin-top: 3px;
}

.zt-statement {
  position: relative;
  max-width: 520px;
  padding-bottom: 24px;
}

.zt-rule {
  width: 54px;
  height: 3px;
  border-radius: 3px;
  margin-bottom: 26px;
  background: linear-gradient(90deg, #22d3ee, #3b82f6);
}

.zt-statement h1 {
  font-family: 'Outfit', sans-serif;
  font-size: 50px;
  line-height: 1.12;
  font-weight: 700;
  letter-spacing: -0.025em;
  color: #ffffff;
  margin-bottom: 20px;
}

.zt-statement p {
  font-size: 15px;
  line-height: 1.75;
  color: #93a8c2;
  max-width: 420px;
  margin: 0;
}

.zt-chips {
  display: flex;
  gap: 10px;
  margin-top: 28px;
}

.zt-chips span {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 14px;
  border-radius: 999px;
  border: 1px solid rgba(125, 211, 252, 0.2);
  background: rgba(8, 20, 40, 0.6);
  font-size: 11px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #a7c4de;
}

.zt-chips i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #22d3ee;
  box-shadow: 0 0 10px #22d3ee;
  animation: zt-pulse 2.4s ease-in-out infinite;
}

@keyframes zt-pulse {
  0%, 100% {
    opacity: 0.35;
  }
  50% {
    opacity: 1;
  }
}

.zt-foot {
  position: relative;
  display: flex;
  justify-content: space-between;
  padding-top: 22px;
  border-top: 1px solid rgba(255, 255, 255, 0.09);
  font-size: 12px;
  letter-spacing: 0.04em;
  color: #6c809b;
}

/* ---------- form side ---------- */
.zt-formside {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 32px;
  overflow: hidden;
  background: #ffffff;
}

/* faint technical grid */
.zt-formside__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(15, 23, 42, 0.075) 1px, transparent 1px),
    linear-gradient(90deg, rgba(15, 23, 42, 0.075) 1px, transparent 1px);
  background-size: 34px 34px;
  mask-image: radial-gradient(ellipse at 50% 45%, #000 20%, transparent 75%);
  -webkit-mask-image: radial-gradient(ellipse at 50% 45%, #000 20%, transparent 75%);
}

/* a cool light pooling behind the form */
.zt-formside__glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 640px;
  height: 640px;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(34, 211, 238, 0.1) 0%, rgba(59, 130, 246, 0.07) 38%, transparent 68%);
  pointer-events: none;
}

/* the seam between the two sides */
.zt-formside__edge {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 2px;
  background: linear-gradient(to bottom, transparent, rgba(34, 211, 238, 0.55), rgba(37, 99, 235, 0.45), transparent);
}

.zt-form {
  position: relative;
  width: 100%;
  max-width: 360px;
}

/* HUD brackets */
.zt-corner {
  position: absolute;
  width: 20px;
  height: 20px;
  pointer-events: none;
}

.zt-corner--tl {
  top: -20px;
  left: -24px;
  border-top: 2px solid rgba(34, 211, 238, 0.65);
  border-left: 2px solid rgba(34, 211, 238, 0.65);
  border-top-left-radius: 6px;
}

.zt-corner--br {
  right: -24px;
  bottom: -20px;
  border-bottom: 2px solid rgba(37, 99, 235, 0.5);
  border-right: 2px solid rgba(37, 99, 235, 0.5);
  border-bottom-right-radius: 6px;
}

.zt-form__mark {
  display: none;
  width: 52px;
  height: 52px;
  border-radius: 15px;
  margin-bottom: 20px;
}

.zt-form__title {
  font-family: 'Outfit', sans-serif;
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #0f172a;
  margin-bottom: 6px;
}

.zt-form__text {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 26px;
}

.zt-form__foot {
  margin-top: 26px;
  text-align: center;
  font-size: 12px;
  color: #94a3b8;
}

@media (max-width: 1279px) {
  .zt-brandside {
    padding: 44px;
  }

  .zt-statement h1 {
    font-size: 40px;
  }
}

@media (max-width: 960px) {
  .zt-login {
    grid-template-columns: 1fr;
  }

  .zt-brandside {
    display: none;
  }

  .zt-form__mark {
    display: block;
  }
}

/* the shared form, tuned for a white panel */
.zt-form :deep(.premium-form) {
  margin-top: 0 !important;
}

.zt-form :deep(.input-group) {
  margin-bottom: 18px !important;
}

.zt-form :deep(.v-label) {
  font-size: 12px !important;
  font-weight: 700 !important;
  letter-spacing: 0.02em;
  color: #334155 !important;
  opacity: 1;
}

.zt-form :deep(.v-field) {
  background: #f8fafc !important;
  border: 1px solid #e2e8f0;
  border-radius: 12px !important;
  box-shadow: none !important;
}

.zt-form :deep(.v-field--focused) {
  background: #ffffff !important;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12) !important;
}

.zt-form :deep(.v-field__input),
.zt-form :deep(input) {
  color: #0f172a !important;
  -webkit-text-fill-color: #0f172a !important;
  caret-color: #0f172a;
  min-height: 46px;
  font-size: 14px;
}

.zt-form :deep(input::placeholder) {
  color: #94a3b8 !important;
  opacity: 1;
}

.zt-form :deep(button[type='submit']) {
  height: 48px !important;
  border-radius: 12px !important;
  background: linear-gradient(120deg, #06b6d4 0%, #2563eb 100%) !important;
  color: #ffffff !important;
  box-shadow: 0 10px 24px rgba(37, 99, 235, 0.25) !important;
}
</style>
