<script setup lang="ts">
import LoginForm from '@/components/auth/LoginForm.vue';
import Logo from '@/layouts/full/logo/LogoAuth.vue';
</script>

<template>
  <div class="premium-layout">
    <div class="mobile-bg d-md-none"></div>

    <v-row class="ma-0 h-100vh w-100">
      
      <v-col cols="12" md="7" lg="7" class="d-none d-md-flex left-pane align-center justify-center pa-12 relative overflow-hidden">
        
        <div class="bg-noise"></div>
        <div class="bg-grid"></div>
        <div class="glow-orb orb-1"></div>
        <div class="glow-orb orb-2"></div>
        <div class="glow-orb orb-3"></div>

        <div class="floating-cube f-cube-1"></div>
        <div class="floating-cube f-cube-2"></div>
        <div class="floating-cube f-cube-3"></div>

        <div class="hero-content w-100 relative z-1" style="max-width: 800px; transform: scale(0.85); transform-origin: center;">
          <div class="animate-fade-up" style="animation-delay: 0.1s;">
            <h1 class="text-h2 font-weight-bold text-white mb-4 tracking-tight">Welcome Back</h1>
            <p class="text-h6 text-white opacity-80 mb-10 font-weight-regular" style="line-height: 1.5; max-width: 480px;">
              Manage clients, their stores, catalog and stock for every Super Mart business from one place.
            </p>
          </div>

          <div class="dash-preview animate-slide-up relative" style="animation-delay: 0.3s;">
            
            <div class="d-flex align-center justify-space-between mb-6">
              <div class="d-flex align-center gap-3">
                <v-avatar color="rgba(255,255,255,0.15)" size="40" rounded="lg">
                  <v-icon color="white">mdi-view-dashboard-outline</v-icon>
                </v-avatar>
                <div class="text-white text-subtitle-1 font-weight-bold">Platform Overview</div>
              </div>
              <div class="fake-tabs">
                <div class="fake-tab active">Overview</div>
                <div class="fake-tab">Stores</div>
              </div>
            </div>

            <div class="kpi-grid mb-4">
              <div class="kpi-card glass">
                <div class="kpi-label">Active Clients</div>
                <div class="kpi-value">148</div>
                <div class="kpi-trend success"><v-icon size="12">mdi-arrow-up-right</v-icon> 12%</div>
              </div>
              <div class="kpi-card glass">
                <div class="kpi-label">Stock Value</div>
                <div class="kpi-value">Rs 42M</div>
                <div class="kpi-trend success"><v-icon size="12">mdi-arrow-up-right</v-icon> 8.4%</div>
              </div>
              <div class="kpi-card glass">
                <div class="kpi-label">Stores</div>
                <div class="kpi-value">612</div>
                <div class="kpi-trend success"><v-icon size="12">mdi-arrow-up-right</v-icon> 2.1%</div>
              </div>
              <div class="kpi-card glass">
                <div class="kpi-label">Low Stock SKUs</div>
                <div class="kpi-value">124</div>
                <div class="kpi-trend warning"><v-icon size="12">mdi-alert-circle-outline</v-icon> Action</div>
              </div>
            </div>

            <div class="bottom-grid">
              
              <div class="chart-card glass">
                <div class="d-flex justify-space-between mb-4">
                  <span class="text-caption text-white font-weight-bold">Stock Health</span>
                  <span class="text-caption text-white opacity-60">Live</span>
                </div>
                
                <div class="progress-item mb-3">
                  <div class="d-flex justify-space-between text-caption text-white opacity-80 mb-1">
                    <span>Main Branches</span><span>80%</span>
                  </div>
                  <v-progress-linear model-value="80" color="#7C5AF5" height="6" rounded></v-progress-linear>
                </div>
                
                <div class="progress-item mb-3">
                  <div class="d-flex justify-space-between text-caption text-white opacity-80 mb-1">
                    <span>City Branches</span><span>45%</span>
                  </div>
                  <v-progress-linear model-value="45" color="#7C5AF5" height="6" rounded></v-progress-linear>
                </div>

                <div class="progress-item">
                  <div class="d-flex justify-space-between text-caption text-white opacity-80 mb-1">
                    <span>Express Stores</span><span>95%</span>
                  </div>
                  <v-progress-linear model-value="95" color="#00e676" height="6" rounded></v-progress-linear>
                </div>
              </div>

              <div class="map-card glass d-flex align-center justify-center relative overflow-hidden">
                <div class="map-pattern"></div>
                <div class="map-pin pin-1"><div class="pulse"></div></div>
                <div class="map-pin pin-2"><div class="pulse"></div></div>
                <div class="map-pin pin-3"><div class="pulse"></div></div>
                <div class="glass-pill absolute-bottom text-caption font-weight-bold text-white">Active Stores: 612</div>
              </div>

            </div>

            <div class="float-card fc-1 glass animate-float">
              <div class="d-flex align-center gap-3">
                <v-avatar color="#00e676" size="32"><v-icon color="white" size="16">mdi-check</v-icon></v-avatar>
                <div>
                  <div class="text-white font-weight-bold text-body-2">98.9% Fill Rate</div>
                  <div class="text-white opacity-60" style="font-size: 10px;">Last 30 days</div>
                </div>
              </div>
            </div>

            <div class="float-card fc-2 glass animate-float-delayed">
              <div class="d-flex align-center gap-3">
                <v-avatar color="#FF3D00" size="32"><v-icon color="white" size="16">mdi-trending-up</v-icon></v-avatar>
                <div>
                  <div class="text-white font-weight-bold text-body-2">+128 Receipts</div>
                  <div class="text-white opacity-60" style="font-size: 10px;">Posted today</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </v-col>


      <v-col cols="12" md="5" lg="5" class="d-flex align-center justify-center right-pane bg-right">
        
        <div class="right-glow d-none d-md-block"></div>

        <div class="w-100 d-flex justify-center z-1 animate-fade-in" style="animation-delay: 0.2s;">
          <v-card class="premium-login-card pa-8 pa-sm-12" width="100%" max-width="520" elevation="0">
            
            <div class="text-center mb-8">
              <Logo class="mb-6" />
              <h2 class="text-h3 font-weight-bold text-textPrimary mb-3 font-inter tracking-tight">Welcome Back</h2>
              <p class="text-body-1 text-textSecondary font-weight-regular">
                Sign in to the Super Mart admin panel.
              </p>
            </div>

            <LoginForm />
            
          </v-card>
        </div>

      </v-col>
    </v-row>
  </div>
</template>

<style scoped lang="scss">
.font-inter {
  font-family: 'Inter', 'Plus Jakarta Sans', sans-serif !important;
}
.tracking-tight {
  letter-spacing: -0.02em;
}

.premium-layout {
  min-height: 100vh;
  background: #ffffff;
  position: relative;
}

.bg-right {
  background: #f8f9fa;  position: relative;
  overflow: hidden;
}

.mobile-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(145deg, #2E1465 0%, #4F2FB6 50%, #6D45E9 100%);
  z-index: 0;
}

.left-pane {
  background: linear-gradient(145deg, #2E1465 0%, #4F2FB6 50%, #6D45E9 100%);
  border-right: 1px solid rgba(255,255,255,0.1);
}

.bg-noise {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  opacity: 0.04;
  mix-blend-mode: overlay;
  pointer-events: none;
}

.bg-grid {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-image: 
    linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
}

.glow-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  z-index: 0;
}
.orb-1 { width: 500px; height: 500px; background: rgba(124, 90, 245, 0.4); top: -10%; left: -10%; }
.orb-2 { width: 600px; height: 600px; background: rgba(91, 61, 189, 0.5); bottom: -20%; right: -10%; }
.orb-3 { width: 300px; height: 300px; background: rgba(0, 230, 118, 0.15); bottom: 30%; left: 10%; }

.right-glow {
  position: absolute;
  top: -10%;
  left: -20%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(91, 61, 189, 0.05) 0%, transparent 70%);
  pointer-events: none;
}

.floating-cube {
  position: absolute;
  background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02));
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 24px;
  box-shadow: 0 16px 32px rgba(0,0,0,0.2), inset 2px 2px 10px rgba(255,255,255,0.1);
  z-index: 0;
  animation: slowFloat 8s ease-in-out infinite alternate;
}
.f-cube-1 { width: 120px; height: 120px; top: 15%; right: 10%; transform: rotate(15deg); }
.f-cube-2 { width: 80px; height: 80px; bottom: 15%; left: 5%; transform: rotate(-25deg); animation-delay: -2s; }
.f-cube-3 { width: 180px; height: 180px; bottom: -5%; right: 20%; transform: rotate(45deg); opacity: 0.3; animation-delay: -4s; border-radius: 40px; }

@keyframes slowFloat {
  0% { transform: translateY(0px) rotate(15deg); }
  100% { transform: translateY(-30px) rotate(25deg); }
}

.dash-preview {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(32px);
  -webkit-backdrop-filter: blur(32px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  border-left: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  box-shadow: 0 32px 64px rgba(0,0,0,0.3), inset 0 0 20px rgba(255,255,255,0.02);
  padding: 32px;
}

.fake-tabs {
  display: flex;
  background: rgba(0,0,0,0.2);
  padding: 4px;
  border-radius: 12px;
}
.fake-tab {
  padding: 6px 16px;
  border-radius: 8px;
  font-size: 12px;
  color: rgba(255,255,255,0.6);
  font-weight: 500;
}
.fake-tab.active {
  background: rgba(255,255,255,0.1);
  color: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.glass {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 16px;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
.kpi-label { color: rgba(255,255,255,0.6); font-size: 11px; margin-bottom: 8px; font-weight: 500; }
.kpi-value { color: #fff; font-size: 20px; font-weight: 800; margin-bottom: 8px; font-family: 'Inter', sans-serif; letter-spacing: -0.5px; }
.kpi-trend { font-size: 11px; font-weight: 600; display: flex; align-items: center; gap: 4px; }
.kpi-trend.success { color: #00e676; }
.kpi-trend.warning { color: #FF9800; }

.bottom-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.map-card {
  background: rgba(0,0,0,0.1) !important;
  min-height: 140px;
}
.map-pattern {
  position: absolute;
  width: 150%;
  height: 150%;
  background-image: radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px);
  background-size: 10px 10px;
  transform: rotate(15deg);
  opacity: 0.5;
}
.map-pin {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #00e676;
  border-radius: 50%;
  box-shadow: 0 0 10px #00e676;
}
.pin-1 { top: 30%; left: 40%; }
.pin-2 { top: 60%; left: 70%; background: #7C5AF5; box-shadow: 0 0 10px #7C5AF5; }
.pin-3 { top: 70%; left: 20%; }
.pulse {
  position: absolute;
  width: 24px;
  height: 24px;
  background: inherit;
  border-radius: 50%;
  top: -8px; left: -8px;
  animation: pulseAnim 2s infinite;
  opacity: 0.4;
}
@keyframes pulseAnim {
  0% { transform: scale(0.5); opacity: 0.6; }
  100% { transform: scale(2); opacity: 0; }
}

.glass-pill {
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(8px);
  padding: 6px 16px;
  border-radius: 20px;
  bottom: 16px;
  border: 1px solid rgba(255,255,255,0.1);
}

.float-card {
  position: absolute;
  padding: 12px 20px;
  border-radius: 100px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.4);
  background: rgba(255,255,255,0.08);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.2);
}
.fc-1 {
  bottom: -20px;
  right: -30px;
}
.fc-2 {
  top: 200px;
  left: -40px;
}

.premium-login-card {
  background: #ffffff !important;
  border-radius: 28px !important;
  box-shadow: 0 32px 64px -12px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.02) !important;
  z-index: 2;
}

.animate-fade-in {
  opacity: 0;
  animation: fadeIn 0.8s ease-out forwards;
}
.animate-fade-up {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeUp 0.8s ease-out forwards;
}
.animate-slide-up {
  opacity: 0;
  transform: translateY(40px);
  animation: fadeUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.animate-float {
  animation: float 6s ease-in-out infinite alternate;
}
.animate-float-delayed {
  animation: float 7s ease-in-out infinite alternate-reverse;
}

@keyframes fadeIn {
  to { opacity: 1; }
}
@keyframes fadeUp {
  to { opacity: 1; transform: translateY(0); }
}
@keyframes float {
  0% { transform: translateY(0); }
  100% { transform: translateY(-15px); }
}

.relative { position: relative; }
.absolute-bottom { position: absolute; bottom: 0; }
.z-1 { z-index: 1; }
</style>
