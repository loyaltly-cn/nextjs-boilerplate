export const apiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Next.js Admin API',
    version: '1.0.0',
    description: 'API documentation for the Next.js Admin System',
  },
  servers: [
    {
      url: 'https://your-domain.com/server/api',
      description: 'Production server',
    },
    {
      url: 'http://localhost:3000/server/api',
      description: 'Development server',
    },
  ],
  paths: {
    '/server/api/test': {
      get: {
        summary: 'Test endpoint',
        description: 'Returns a test message',
        tags: ['Test'],
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    msg: {
                      type: 'string',
                      example: 'test',
                    },
                  },
                },
              },
            },
          },
          '500': {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: {
                      type: 'string',
                      example: 'Internal Server Error',
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        summary: 'Test POST endpoint',
        description: 'Returns the posted data with a test message',
        tags: ['Test'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                additionalProperties: true,
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    msg: {
                      type: 'string',
                      example: 'test',
                    },
                    data: {
                      type: 'object',
                      description: 'The posted data',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/server/api/chat': {
      get: {
        summary: '获取聊天列表',
        description: '获取所有聊天会话列表（需要管理员权限）',
        tags: ['Chat'],
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: '成功获取聊天列表',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Chat'
                  }
                }
              }
            }
          }
        }
      },
      post: {
        summary: '创建新聊天',
        description: '创建新的客服聊天会话',
        tags: ['Chat'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  userName: {
                    type: 'string',
                    description: '用户名称'
                  },
                  message: {
                    type: 'string',
                    description: '初始消息内容'
                  }
                },
                required: ['userName', 'message']
              }
            }
          }
        },
        responses: {
          '200': {
            description: '成功创建聊天',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Chat'
                }
              }
            }
          }
        }
      }
    },
    '/server/api/chat/{chatId}/messages': {
      parameters: [
        {
          name: 'chatId',
          in: 'path',
          required: true,
          schema: {
            type: 'string'
          },
          description: '聊天会话 ID'
        }
      ],
      get: {
        summary: '获取聊天消息',
        description: '获取指定聊天会话的所有消息',
        tags: ['Chat'],
        responses: {
          '200': {
            description: '成功获取消息列表',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Message'
                  }
                }
              }
            }
          }
        }
      },
      post: {
        summary: '发送消息',
        description: '在指定聊天会话中发送新消息',
        tags: ['Chat'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  content: {
                    type: 'string',
                    description: '消息内容'
                  }
                },
                required: ['content']
              }
            }
          }
        },
        responses: {
          '200': {
            description: '成功发送消息',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Message'
                }
              }
            }
          }
        }
      }
    },
    '/server/api/auth/register': {
      post: {
        summary: '用户注册',
        description: '创建新用户账号',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: '用户名称（可选）'
                  },
                  email: {
                    type: 'string',
                    format: 'email',
                    description: '邮箱地址'
                  },
                  password: {
                    type: 'string',
                    format: 'password',
                    description: '密码'
                  }
                },
                required: ['email', 'password']
              }
            }
          }
        },
        responses: {
          '200': {
            description: '注册成功',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'string',
                      description: '用户ID'
                    },
                    name: {
                      type: 'string',
                      description: '用户名称'
                    },
                    email: {
                      type: 'string',
                      description: '邮箱地址'
                    }
                  }
                }
              }
            }
          },
          '400': {
            description: '请求参数错误',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: {
                      type: 'string',
                      example: 'Email already registered'
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/server/api/auth/login': {
      post: {
        summary: '用户登录',
        description: '使用邮箱和密码登录',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: {
                    type: 'string',
                    format: 'email',
                    description: '邮箱地址'
                  },
                  password: {
                    type: 'string',
                    format: 'password',
                    description: '密码'
                  }
                },
                required: ['email', 'password']
              }
            }
          }
        },
        responses: {
          '200': {
            description: '登录成功',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    token: {
                      type: 'string',
                      description: 'JWT token'
                    },
                    user: {
                      type: 'object',
                      properties: {
                        id: {
                          type: 'string',
                          description: '用户ID'
                        },
                        name: {
                          type: 'string',
                          description: '用户名称'
                        },
                        email: {
                          type: 'string',
                          description: '邮箱地址'
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          '401': {
            description: '认证失败',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: {
                      type: 'string',
                      example: 'Invalid credentials'
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/server/api/appointments': {
      get: {
        summary: '获取预约列表',
        description: '获取所有预约记录（需要登录）',
        tags: ['Appointments'],
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: '成功获取预约列表',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Appointment'
                  }
                }
              }
            }
          }
        }
      },
      post: {
        summary: '创建预约',
        description: '创建新的预约记录',
        tags: ['Appointments'],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: {
                    type: 'string',
                    description: '预约标题'
                  },
                  description: {
                    type: 'string',
                    description: '预约描述'
                  },
                  startTime: {
                    type: 'string',
                    format: 'date-time',
                    description: '开始时间'
                  },
                  endTime: {
                    type: 'string',
                    format: 'date-time',
                    description: '结束时间'
                  }
                },
                required: ['title', 'startTime', 'endTime']
              }
            }
          }
        },
        responses: {
          '200': {
            description: '成功创建预约',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Appointment'
                }
              }
            }
          }
        }
      }
    },
    '/server/api/appointments/{id}': {
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'string'
          },
          description: '预约 ID'
        }
      ],
      get: {
        summary: '获取预约详情',
        description: '获取指定预约的详细信息',
        tags: ['Appointments'],
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: '成功获取预约详情',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Appointment'
                }
              }
            }
          }
        }
      },
      put: {
        summary: '更新预约',
        description: '更新指定预约的信息',
        tags: ['Appointments'],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: {
                    type: 'string',
                    description: '预约标题'
                  },
                  description: {
                    type: 'string',
                    description: '预约描述'
                  },
                  startTime: {
                    type: 'string',
                    format: 'date-time',
                    description: '开始时间'
                  },
                  endTime: {
                    type: 'string',
                    format: 'date-time',
                    description: '结束时间'
                  },
                  status: {
                    type: 'string',
                    enum: ['PENDING', 'CONFIRMED', 'CANCELLED'],
                    description: '预约状态'
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: '成功更新预约',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Appointment'
                }
              }
            }
          }
        }
      },
      delete: {
        summary: '删除预约',
        description: '删除指定的预约记录',
        tags: ['Appointments'],
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: '成功删除预约',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/server/api/about': {
      get: {
        summary: '获取关于我们列表',
        description: `
          获取关于我们页面的内容列表，支持分页和分类筛选。
          - 可以按照 NEWS(新闻)、STORY(故事)、UPDATE(更新) 进行分类筛选
          - 默认按照排序值(order)升序和发布时间(publishDate)降序排列
          - 默认每页显示10条记录
        `,
        tags: ['About'],
        parameters: [
          {
            name: 'category',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['NEWS', 'STORY', 'UPDATE']
            },
            description: '内容分类（可选）：NEWS-新闻，STORY-故事，UPDATE-更新'
          },
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              default: 1,
              minimum: 1
            },
            description: '页码，从1开始'
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              default: 10,
              minimum: 1,
              maximum: 100
            },
            description: '每页显示数量，默认10条，最大100条'
          }
        ],
        responses: {
          '200': {
            description: '成功获取列表',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    items: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/AboutItem'
                      },
                      description: '内容列表'
                    },
                    pagination: {
                      type: 'object',
                      properties: {
                        page: {
                          type: 'integer',
                          description: '当前页码'
                        },
                        limit: {
                          type: 'integer',
                          description: '每页显示数量'
                        },
                        total: {
                          type: 'integer',
                          description: '总记录数'
                        },
                        totalPages: {
                          type: 'integer',
                          description: '总页数'
                        }
                      }
                    }
                  }
                },
                example: {
                  items: [
                    {
                      id: "clsxxxxxxxxxxxxxx",
                      image: "https://example.com/image.jpg",
                      title: "公司动态标题",
                      description: "这是一条公司动态的简短描述",
                      content: "这是详细的内容...",
                      author: "张三",
                      publishDate: "2024-03-20T10:00:00Z",
                      category: "NEWS",
                      order: 1,
                      isActive: true
                    }
                  ],
                  pagination: {
                    page: 1,
                    limit: 10,
                    total: 100,
                    totalPages: 10
                  }
                }
              }
            }
          }
        }
      },
      post: {
        summary: '创建关于我们内容',
        description: `
          创建新的关于我们内容（需要管理员权限）
          - 必填字段：title, image, description, content, category, publishDate
          - 图片需要先上传到图服务器，这里只需要传入URL
          - order字段用于自定义排序，值越小越靠前
        `,
        tags: ['About'],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'image', 'description', 'content', 'category', 'publishDate'],
                properties: {
                  title: {
                    type: 'string',
                    description: '标题',
                    maxLength: 100
                  },
                  image: {
                    type: 'string',
                    description: '封面图片URL',
                    format: 'uri'
                  },
                  description: {
                    type: 'string',
                    description: '简短描述',
                    maxLength: 200
                  },
                  content: {
                    type: 'string',
                    description: '详细内容，支持HTML格式'
                  },
                  author: {
                    type: 'string',
                    description: '作者名称',
                    maxLength: 50
                  },
                  publishDate: {
                    type: 'string',
                    format: 'date-time',
                    description: '发布时间，ISO 8601格式'
                  },
                  category: {
                    type: 'string',
                    enum: ['NEWS', 'STORY', 'UPDATE'],
                    description: '内容分类'
                  },
                  order: {
                    type: 'integer',
                    description: '排序值，越小越靠前',
                    default: 0
                  }
                }
              },
              example: {
                title: "公司动态标题",
                image: "https://example.com/image.jpg",
                description: "这是一条公司动态的简短描述",
                content: "<p>这是详细的内容...</p>",
                author: "张三",
                publishDate: "2024-03-20T10:00:00Z",
                category: "NEWS",
                order: 1
              }
            }
          }
        },
        responses: {
          '200': {
            description: '创建成功',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AboutItem'
                }
              }
            }
          },
          '400': {
            description: '请求参数错误',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: {
                      type: 'string',
                      example: 'Missing required fields'
                    }
                  }
                }
              }
            }
          },
          '401': {
            description: '未授权（需要管理员权限）',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: {
                      type: 'string',
                      example: 'Unauthorized'
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/server/api/about/{id}': {
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'string'
          },
          description: '关于我们内容ID'
        }
      ],
      get: {
        summary: '获取关于我们内容详情',
        description: '获取指定关于我们内容的详细信息',
        tags: ['About'],
        responses: {
          '200': {
            description: '成功获取关于我们内容详情',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AboutItem'
                }
              }
            }
          }
        }
      },
      put: {
        summary: '更新关于我们内容',
        description: '更新指定关于我们内容的信息',
        tags: ['About'],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: {
                    type: 'string',
                    description: '标题'
                  },
                  image: {
                    type: 'string',
                    format: 'uri',
                    description: '封面图片URL'
                  },
                  description: {
                    type: 'string',
                    description: '简短描述'
                  },
                  content: {
                    type: 'string',
                    description: '详细内容，支持HTML格式'
                  },
                  author: {
                    type: 'string',
                    description: '作者名称'
                  },
                  publishDate: {
                    type: 'string',
                    format: 'date-time',
                    description: '发布时间，ISO 8601格式'
                  },
                  category: {
                    type: 'string',
                    enum: ['NEWS', 'STORY', 'UPDATE'],
                    description: '内容分类'
                  },
                  order: {
                    type: 'integer',
                    description: '排序值，越小越靠前'
                  },
                  isActive: {
                    type: 'boolean',
                    description: '是否激活'
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: '成功更新关于我们内容',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AboutItem'
                }
              }
            }
          }
        }
      },
      delete: {
        summary: '删除关于我们内容',
        description: '删除指定的关于我们内容',
        tags: ['About'],
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: '成功删除关于我们内容',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/server/api/about/video': {
      get: {
        summary: '获取关于我们视频',
        description: '获取关于我们页面的视频 URL',
        tags: ['About'],
        responses: {
          '200': {
            description: '成功获取视频信息',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AboutVideo'
                },
                example: {
                  id: "video",
                  url: "https://example.com/about-video.mp4",
                  createdAt: "2024-03-20T10:00:00Z",
                  updatedAt: "2024-03-20T10:00:00Z"
                }
              }
            }
          }
        }
      },
      put: {
        summary: '更新关于我们视频',
        description: '更新关于我们页面的视频 URL（需要管理员权限）',
        tags: ['About'],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  url: {
                    type: 'string',
                    format: 'uri',
                    description: '视频URL'
                  }
                },
                required: ['url']
              },
              example: {
                url: "https://example.com/about-video.mp4"
              }
            }
          }
        },
        responses: {
          '200': {
            description: '更新成功',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AboutVideo'
                }
              }
            }
          },
          '400': {
            description: '请求参数错误',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: {
                      type: 'string',
                      example: 'URL is required'
                    }
                  }
                }
              }
            }
          },
          '401': {
            description: '未授权（需要管理员权限）',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: {
                      type: 'string',
                      example: 'Unauthorized'
                    }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        summary: '创建关于我们视频',
        description: '创建新的关于我们视频 URL（需要管理员权限）。如果已存在视频，则会返回 400 错误。',
        tags: ['About'],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  url: {
                    type: 'string',
                    format: 'uri',
                    description: '视频URL'
                  }
                },
                required: ['url']
              },
              example: {
                url: "https://example.com/about-video.mp4"
              }
            }
          }
        },
        responses: {
          '200': {
            description: '创建成功',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AboutVideo'
                }
              }
            }
          },
          '400': {
            description: '请求参数错误或视频已存在',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: {
                      type: 'string',
                      example: 'URL is required or Video already exists'
                    }
                  }
                }
              }
            }
          },
          '401': {
            description: '未授权（需要管理员权限）',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: {
                      type: 'string',
                      example: 'Unauthorized'
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/server/api/about/video/{id}': {
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'string'
          },
          description: '关于我们视频ID'
        }
      ],
      get: {
        summary: '获取关于我们视频详情',
        description: '获取指定关于我们视频的详细信息',
        tags: ['About'],
        responses: {
          '200': {
            description: '成功获取关于我们视频详情',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AboutVideo'
                }
              }
            }
          }
        }
      },
      put: {
        summary: '更新关于我们视频',
        description: '更新指定关于我们视频的信息',
        tags: ['About'],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  url: {
                    type: 'string',
                    format: 'uri',
                    description: '视频URL'
                  }
                },
                required: ['url']
              }
            }
          }
        },
        responses: {
          '200': {
            description: '成功更新关于我们视频',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AboutVideo'
                }
              }
            }
          }
        }
      },
      delete: {
        summary: '删除关于我们视频',
        description: '删除指定的关于我们视频',
        tags: ['About'],
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: '成功删除关于我们视频',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/server/api/view': {
      get: {
        summary: '获取所有视图',
        description: '获取所有可用的视图列表',
        tags: ['View'],
        parameters: [
          {
            name: 'isActive',
            in: 'query',
            description: '是否只返回激活的视图',
            required: false,
            schema: {
              type: 'boolean'
            }
          },
          {
            name: 'limit',
            in: 'query',
            description: '返回结果的最大数量',
            required: false,
            schema: {
              type: 'integer',
              minimum: 1,
              default: 10
            }
          }
        ],
        responses: {
          '200': {
            description: '成功获取视图列表',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    items: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/View'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        summary: '创建新视图',
        description: '创建一个新的视图（需要管理员权限）',
        tags: ['View'],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'desc', 'background'],
                properties: {
                  title: {
                    type: 'string',
                    description: '视图标题',
                    example: '首页横幅'
                  },
                  desc: {
                    type: 'string',
                    description: '视图描述',
                    example: '首页顶部的主要展示区域'
                  },
                  background: {
                    type: 'string',
                    format: 'uri',
                    description: '背景图片URL',
                    example: 'https://example.com/images/banner.jpg'
                  },
                  order: {
                    type: 'integer',
                    description: '排序值',
                    default: 0
                  },
                  isActive: {
                    type: 'boolean',
                    description: '是否激活',
                    default: true
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: '成功创建视图',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true
                    },
                    view: {
                      $ref: '#/components/schemas/View'
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/server/api/view/{id}': {
      parameters: [
        {
          name: 'id',
          in: 'path',
          description: '视图ID',
          required: true,
          schema: {
            type: 'string'
          }
        }
      ],
      get: {
        summary: '获取单个视图',
        description: '通过ID获取特定视图的详细信息',
        tags: ['View'],
        responses: {
          '200': {
            description: '成功获取视图',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/View'
                }
              }
            }
          }
        }
      },
      put: {
        summary: '更新视图',
        description: '更新指定视图的信息（需要管理员权限）',
        tags: ['View'],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: {
                    type: 'string',
                    description: '视图标题'
                  },
                  desc: {
                    type: 'string',
                    description: '视图描述'
                  },
                  background: {
                    type: 'string',
                    format: 'uri',
                    description: '背景图片URL'
                  },
                  order: {
                    type: 'integer',
                    description: '排序值'
                  },
                  isActive: {
                    type: 'boolean',
                    description: '是否激活'
                  }
                }
              }
            }
          }
        }
      },
      delete: {
        summary: '删除视图',
        description: '删除指定的视图（需要管理员权限）',
        tags: ['View'],
        security: [{ BearerAuth: [] }]
      }
    }
  },
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      Chat: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: '聊天会话 ID'
          },
          userName: {
            type: 'string',
            description: '用户名称'
          },
          status: {
            type: 'string',
            enum: ['OPEN', 'CLOSED'],
            description: '聊天状态'
          },
          messages: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Message'
            },
            description: '聊天消息列表'
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: '创建时间'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: '更新时间'
          }
        }
      },
      Message: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: '消息 ID'
          },
          content: {
            type: 'string',
            description: '消息内容'
          },
          role: {
            type: 'string',
            enum: ['USER', 'ADMIN'],
            description: '发送者角色'
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: '发送时间'
          }
        }
      },
      Appointment: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: '预约 ID'
          },
          title: {
            type: 'string',
            description: '预约标题'
          },
          description: {
            type: 'string',
            description: '预约描述'
          },
          startTime: {
            type: 'string',
            format: 'date-time',
            description: '开始时间'
          },
          endTime: {
            type: 'string',
            format: 'date-time',
            description: '结束时间'
          },
          status: {
            type: 'string',
            enum: ['PENDING', 'CONFIRMED', 'CANCELLED'],
            description: '预约状态'
          },
          userId: {
            type: 'string',
            description: '用户 ID'
          },
          user: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: '用户名称'
              },
              email: {
                type: 'string',
                description: '用户邮箱'
              }
            }
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: '创建时间'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: '更新时间'
          }
        }
      },
      AboutItem: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: '内容ID'
          },
          image: {
            type: 'string',
            format: 'uri',
            description: '图片URL'
          },
          title: {
            type: 'string',
            description: '标题'
          },
          description: {
            type: 'string',
            description: '简短描述'
          },
          content: {
            type: 'string',
            description: '详细内容'
          },
          order: {
            type: 'integer',
            description: '排序值，值越小越靠前'
          },
          isActive: {
            type: 'boolean',
            description: '是否激活，false则不会在前台显示'
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: '创建时间'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: '最后更新时间'
          }
        }
      },
      AboutVideo: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: '视频记录ID'
          },
          url: {
            type: 'string',
            format: 'uri',
            description: '视频URL'
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: '创建时间'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: '更新时间'
          }
        }
      },
      View: {
        type: 'object',
        required: ['title', 'desc', 'background'],
        properties: {
          id: {
            type: 'string',
            description: '视图ID'
          },
          title: {
            type: 'string',
            description: '视图标题',
            example: '首页横幅'
          },
          desc: {
            type: 'string',
            description: '视图描述',
            example: '首页顶部的主要展示区域'
          },
          background: {
            type: 'string',
            format: 'uri',
            description: '背景图片URL',
            example: 'https://example.com/images/banner.jpg'
          },
          order: {
            type: 'integer',
            description: '排序值，值越小越靠前',
            default: 0,
            example: 1
          },
          isActive: {
            type: 'boolean',
            description: '是否激活，false则不会显示',
            default: true,
            example: true
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: '创建时间'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: '更新时间'
          }
        }
      }
    }
  },
} 