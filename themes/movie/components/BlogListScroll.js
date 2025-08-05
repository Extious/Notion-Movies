import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import throttle from 'lodash.throttle'
import { useCallback, useEffect, useRef, useState } from 'react'
import CONFIG from '../config'
import BlogPostCard from './BlogPostCard'

export const BlogListScroll = props => {
  const { posts } = props
  const { locale } = useGlobal()

  const [page, updatePage] = useState(1)

  let hasMore = false
  const postsToShow = posts
    ? Object.assign(posts).slice(
        0,
        parseInt(siteConfig('POSTS_PER_PAGE', 12, props?.NOTION_CONFIG)) * page
      )
    : []

  if (posts) {
    const totalCount = posts.length
    hasMore =
      page * parseInt(siteConfig('POSTS_PER_PAGE', 12, props?.NOTION_CONFIG)) <
      totalCount
  }
  const handleGetMore = () => {
    if (!hasMore) return
    updatePage(page + 1)
  }

  const targetRef = useRef(null)

  // 监听滚动自动分页加载
  const scrollTrigger = useCallback(
    throttle(() => {
      const scrollS = window.scrollY + window.outerHeight
      const clientHeight = targetRef
        ? targetRef.current
          ? targetRef.current.clientHeight
          : 0
        : 0
      if (scrollS > clientHeight + 100) {
        handleGetMore()
      }
    }, 500)
  )
  const showPageCover = siteConfig('MOVIE_POST_LIST_COVER', null, CONFIG)
  const cardSize = siteConfig('MOVIE_CARD_SIZE', 'small', CONFIG)

  // 根据卡片大小设置网格列数
  const getGridClasses = () => {
    switch (cardSize) {
      case 'large':
        return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
      case 'medium':
        return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
      case 'small':
      default:
        return 'grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', scrollTrigger)

    return () => {
      window.removeEventListener('scroll', scrollTrigger)
    }
  })

  return (
    <div
      id='posts-wrapper'
      className={`w-full ${showPageCover ? 'md:pr-2' : 'md:pr-12'}} mb-12`}
      ref={targetRef}>
      <div className={`grid ${getGridClasses()} gap-4`}>
        {postsToShow?.map(post => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>

      <div
        onClick={handleGetMore}
        className='w-full my-4 py-4 text-center cursor-pointer '>
        {' '}
        {hasMore ? locale.COMMON.MORE : `${locale.COMMON.NO_MORE} 😰`}{' '}
      </div>
    </div>
  )
}
