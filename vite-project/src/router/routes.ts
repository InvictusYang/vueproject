//对外暴露配置路由
export const constantRoute = [
        {
            //登录
            path:'/login',
            component:()=>import('@/views/login/index.vue'),
            name:'login',//命名路由,做权限时需要用name区分
            meta:{
                title:"登录",//菜单标题
                hidden:true,//代表标题在菜单中是否隐藏，true隐藏，false不隐藏
                icon:"Promotion"//菜单左侧图标，支持element-plus全部图标
            }
        },

        {
            //登录成功后展示数据
            path:'/',
            component:()=>import('@/layout/index.vue'),
            name:'layout',//名字随意
            meta:{
                title:"",//菜单标题
                hidden:false,
                icon:""//菜单左侧图标，支持element-plus全部图标
            },
            // 重定向到home
            redirect:'/home',
            children:[
                {
                    path:'/home',
                    component:()=>import('@/views/home/index.vue'),
                    meta:{
                        title:"首页",//菜单标题
                        hidden:false,
                        icon:"HomeFilled"
                    }
                }
            ]
        },

        {
            //404
            path:'/404',
            component:()=>import('@/views/404/index.vue'),
            name:'notFound',
            meta:{
                title:"404",//菜单标题
                hidden:true,
                icon:"Close"

            }
        },
        {
            path:'/screen',
            component:()=>import('@/views/screen/index.vue'),
            name:'Screen',
            meta:{
                hidden:false,
                title:'数据大屏',
                icon:'DataLine'
            }
        },
        {
            path:'/acl',
            component:()=>import('@/layout/index.vue'),
            name:'Acl',
            meta:{
                hidden: false,
                title:'权限管理',
                icon:'Unlock'
            },
            redirect: '/acl/user',
            children:[
                {
                    path:'/acl/user',
                    component:()=>import('@/views/acl/user/index.vue'),
                    name:'User',
                    meta:{
                        title:'用户管理',
                        hidden: false,
                        icon:'Avatar'
                    }
                },
                {
                    path:'/acl/role',
                    component:()=>import('@/views/acl/role/index.vue'),
                    name:'Role',
                    meta:{
                        title:'角色管理',
                        hidden: false,
                        icon:'User'
                    }
                },
                {
                    path:'/acl/permission',
                    component:()=>import('@/views/acl/permission/index.vue'),
                    name:'Permission',
                    meta:{
                        title:'菜单管理',
                        hidden: false,
                        icon:'Tools'
                    }
                }

            ]
        },

        {
            path:'/product',
            component:()=>import('@/layout/index.vue'),
            name:'Product',
            meta:{
                title:'产品管理',
                hidden:false,
                icon:'Goods'
            },
            redirect: '/product/brand',
            children: [
                {
                    path:'/product/brand',
                    component:()=>import('@/views/product/brand/index.vue'),
                    name:'Brand',
                    meta:{
                        title:'品牌管理',
                        hidden: false,
                        icon:'Discount'
                    }
                },
                {
                    path:'/product/attr',
                    component:()=>import('@/views/product/attr/index.vue'),
                    name:'Attr',
                    meta:{
                        title:'属性管理',
                        hidden: false,
                        icon:'Flag'
                    }
                },
                {
                    path:'/product/sku',
                    component:()=>import('@/views/product/sku/index.vue'),
                    name:'Sku',
                    meta:{
                        title:'sku管理',
                        hidden: false,
                        icon:'Key'
                    }
                },
                {
                    path:'/product/spu',
                    component:()=>import('@/views/product/spu/index.vue'),
                    name:'Spu',
                    meta:{
                        title:'spu管理',
                        hidden: false,
                        icon:'Stamp'
                    }
                }
            ]
        },

        {
            //任意路径，不能匹配则跳404
            path:'/:patchMatch(.*)*',
            redirect:'/404',
            name:'Any',
            meta:{
                title:"任意路由",//菜单标题
                hidden:true,
                icon:"Van"
            }
        }
    ]
