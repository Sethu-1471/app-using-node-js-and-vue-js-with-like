import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue'),
    meta: {
      requiresAuth: true
  }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: {
      guest: true
  }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: {
      guest: true
  }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/Profile.vue'),
    meta: {
      requiresAuth: true
  }
  },
  {
    path: '/profile/:id',
    name: 'UserProfile',
    component: () => import('../views/UserProfile.vue'),
  },
  {
    path: '/editpost/:id',
    name: 'EditPost',
    component: () => import('../views/EditPost.vue'),
    meta: {
      requiresAuth: true
  }
  },
  {
    path: '/notification',
    name: 'Notification',
    component: () => import('../views/notify.vue'),
    meta: {
      requiresAuth: true
  }
  },
  {
    path: '/add/post',
    name: 'AddPost',
    component: () => import('../views/AddPost.vue'),
    meta: {
      requiresAuth: true
  }
  },
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
      if (localStorage.getItem('jwt') == null) {
          next({
              path: '/login',
          })
      } else {
        let userAdmin = localStorage.getItem('isAdmin')
        if(to.matched.some(record => record.meta.is_admin)) {
          if(userAdmin){
              next()
          }
          else{
              next({ path: "/" })
          }
      }else {
          next()
      }
      }
  } else if(to.matched.some(record => record.meta.guest)) {
      if(localStorage.getItem('jwt') == null){
          next()
      }
      else{
        next({ 
            path: "/"
          })
      }
  }else {
      next()
  }
})


// To avoid Display error
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
}


export default router;
