import LazyImage from '@/components/LazyImage'
import NotionIcon from '@/components/NotionIcon'
import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
import TagItemMini from './TagItemMini'
import CONFIG from '../config'

const BlogPostCard = ({ index, post, showSummary, siteInfo }) => {
  // 主题默认强制显示图片
  if (post && !post.pageCoverThumbnail) {
    post.pageCoverThumbnail =
      siteInfo?.pageCover || siteConfig('RANDOM_IMAGE_URL')
  }

  // 根据配置获取卡片大小
  const cardSize = siteConfig('MOVIE_CARD_SIZE', 'small', CONFIG)
  
  // 根据大小设置不同的样式
  const getSizeClasses = () => {
    switch (cardSize) {
      case 'large':
        return {
          container: 'max-w-md mx-auto',
          aspect: 'aspect-[2/3]',
          title: 'text-2xl',
          padding: 'px-6',
          bottom: 'bottom-10',
          tagBottom: 'bottom-28',
          tagPadding: 'p-2',
          summaryBottom: 'bottom-3',
          summaryMargin: 'mx-6'
        }
      case 'medium':
        return {
          container: 'max-w-sm mx-auto',
          aspect: 'aspect-[3/4]',
          title: 'text-lg',
          padding: 'px-4',
          bottom: 'bottom-8',
          tagBottom: 'bottom-20',
          tagPadding: 'p-1',
          summaryBottom: 'bottom-2',
          summaryMargin: 'mx-4'
        }
      case 'small':
      default:
        return {
          container: 'max-w-xs mx-auto',
          aspect: 'aspect-[4/5]',
          title: 'text-base',
          padding: 'px-3',
          bottom: 'bottom-6',
          tagBottom: 'bottom-16',
          tagPadding: 'p-1',
          summaryBottom: 'bottom-1',
          summaryMargin: 'mx-3'
        }
    }
  }

  const sizeClasses = getSizeClasses()

  return (
    <article
      data-wow-delay='.2s'
      className={`w-full mb-4 cursor-pointer overflow-hidden shadow-movie dark:bg-hexo-black-gray text-white ${sizeClasses.container}`}>
      <SmartLink href={post?.href} passHref legacyBehavior>
        {/* 根据配置调整高度 */}
        <div className={`group flex flex-col ${sizeClasses.aspect} justify-between relative`}>
          {/* 图片 填充卡片 */}
          <div className='flex flex-grow w-full h-full relative duration-200  cursor-pointer transform overflow-hidden'>
            <LazyImage
              src={post?.pageCoverThumbnail}
              alt={post.title}
              className='h-full w-full group-hover:brightness-90 group-hover:scale-105 transform object-cover duration-500'
            />
          </div>

          <div className={`absolute ${sizeClasses.tagBottom} z-20`}>
            {post?.tagItems && post?.tagItems.length > 0 && (
              <>
                <div className={`${sizeClasses.padding} justify-between flex ${sizeClasses.tagPadding}`}>
                  {post.tagItems.map(tag => (
                    <TagItemMini key={tag.name} tag={tag} />
                  ))}
                </div>
              </>
            )}
          </div>
          {/* 阴影遮罩 */}
          <h2 className={`absolute ${sizeClasses.bottom} ${sizeClasses.padding} transition-all duration-200 ${sizeClasses.title} font-semibold break-words shadow-text z-20`}>
            {siteConfig('POST_TITLE_ICON') && (
              <NotionIcon icon={post.pageIcon} />
            )}
            {post.title}
          </h2>

          <p className={`absolute ${sizeClasses.summaryBottom} z-20 line-clamp-1 text-xs ${sizeClasses.summaryMargin}`}>
            {post?.summary}
          </p>

          <div className='h-3/4 w-full absolute left-0 bottom-0 z-10'>
            <div className='h-full w-full absolute opacity-80 group-hover:opacity-100 transition-all duration-1000 bg-gradient-to-b from-transparent to-black'></div>
          </div>
        </div>
      </SmartLink>
    </article>
  )
}

export default BlogPostCard
