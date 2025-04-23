import { BlogEntity } from '@/apis/blog/blog.entity';
import { Category } from '@/apis/categories/categories.entity';
import { Role } from '@/apis/roles/entities/role.entity';
import { RoleEnum } from '@/apis/roles/roles.enum';
import { UserEntity } from '@/apis/user/entities/user.entity';
import { EntityManager } from 'typeorm';

export const seedData = async (manager: EntityManager) => {
	await seedRole();
	await seedUser();
	await seedCategory();
	await seedBlog();

	async function seedCategory() {
		const categoryRepository = manager.getRepository(Category);
		const categoryExist = await categoryRepository.find();
		if (categoryExist.length > 0) {
			return;
		}
		const categories = [
			{
				name: 'Vận tải đường bộ',
				description: 'Dịch vụ vận tải hàng hóa bằng đường bộ',
				content:
					'<p>Dịch vụ vận tải hàng hóa bằng đường bộ, bao gồm xe tải, xe container và các phương tiện chuyên dụng khác.</p><ul><li>Vận chuyển hàng hóa nội địa</li><li>Vận chuyển hàng hóa quốc tế (qua biên giới)</li><li>Dịch vụ giao nhận hàng tận nơi</li></ul>'
			},
			{
				name: 'Vận tải đường biển',
				description: 'Dịch vụ vận tải hàng hóa bằng đường biển',
				content:
					'<p>Dịch vụ vận tải hàng hóa bằng đường biển, sử dụng tàu container, tàu hàng rời và các loại tàu biển khác.</p><ol><li>Vận chuyển hàng hóa xuất nhập khẩu</li><li>Vận chuyển hàng hóa giữa các cảng biển</li><li>Dịch vụ thuê tàu, thuê container</li></ol>'
			},
			{
				name: 'Vận tải hàng không',
				description: 'Dịch vụ vận tải hàng hóa bằng đường hàng không',
				content:
					'<div><h3>Vận chuyển hàng hóa nhanh chóng</h3><p>Dịch vụ vận tải hàng hóa bằng đường hàng không, đảm bảo thời gian giao hàng nhanh nhất.</p><p>Các dịch vụ bao gồm:</p><ul><li>Vận chuyển hàng hóa khẩn cấp</li><li>Vận chuyển hàng hóa giá trị cao</li><li>Dịch vụ giao nhận hàng tại sân bay</li></ul></div>'
			},
			{
				name: 'Dịch vụ kho bãi',
				description: '',
				content:
					'<section><h4>Lưu trữ và quản lý hàng hóa</h4><p>Dịch vụ kho bãi chuyên nghiệp, đảm bảo an toàn và hiệu quả cho hàng hóa của bạn.</p><table border="1"><tr><th>Dịch vụ</th><th>Lợi ích</th></tr><tr><td>Lưu trữ hàng hóa</td><td>An toàn, bảo quản tốt</td></tr><tr><td>Quản lý tồn kho</td><td>Theo dõi chính xác, giảm thiểu sai sót</td></tr></table></section>'
			},
			{
				name: 'Tư vấn logistics',
				description: '',
				content:
					'<article><h2>Giải pháp logistics toàn diện</h2><p>Dịch vụ tư vấn logistics giúp tối ưu hóa chuỗi cung ứng và giảm chi phí vận chuyển.</p><blockquote>"Chuyên gia tư vấn logistics hàng đầu" - Đánh giá từ khách hàng</blockquote></article>'
			}
		];

		for (const categoryData of categories) {
			const existingCategory = await categoryRepository.findOne({
				where: { name: categoryData.name }
			});
			if (!existingCategory) {
				const category = categoryRepository.create(categoryData);
				await categoryRepository.save(category);
			}
		}

		console.log('Categories have been seeded');
	}

	async function seedUser() {
		const userRepository = manager.getRepository(UserEntity);
		const roleRepository = manager.getRepository(Role);
		const userExist = await userRepository.find();

		if (userExist.length > 0) {
			return;
		}
		const users = [
			{
				username: 'admin',
				email: 'admin@vntransp.com',
				password: 'admin@vntransp',
				roleName: 'Admin'
			},
			{
				username: 'moderator',
				email: 'moderator@example.com',
				password: 'string',
				roleName: 'Moderator'
			},
			{ username: 'user1', email: 'user@example.com', password: 'string', roleName: 'User' },
			{ username: 'user2', email: 'user2@example.com', password: 'string', roleName: 'User' }
		];

		for (const userData of users) {
			const existingUser = await userRepository.findOne({ where: { email: userData.email } });
			if (!existingUser) {
				const role = await roleRepository.findOne({ where: { name: userData.roleName } });
				if (role) {
					const user = userRepository.create({
						username: userData.username,
						email: userData.email,
						password: userData.password,
						role: role
					});
					await userRepository.save(user);
				}
			}
		}

		console.log('Users have been seeded');
	}

	async function seedRole() {
		const roleRepository = manager.getRepository(Role);
		const roleExist = await roleRepository.find();
		if (roleExist.length > 0 && roleExist.length === Object.values(RoleEnum).length) {
			return;
		}
		Object.values(RoleEnum).forEach(async (roleData) => {
			const existingRole = await roleRepository.findOne({ where: { name: roleData } });
			if (!existingRole) {
				const role = roleRepository.create({ name: roleData });
				await roleRepository.save(role);
			}
		});

		console.log('Roles have been seeded');
	}

	async function seedBlog() {
		const blogRepository = manager.getRepository(BlogEntity);
		const blogExist = await blogRepository.find();
		if (blogExist.length > 0) {
			return;
		}

		const blogs = [
			{
				title: 'Báo cáo doanh số bán hàng tháng 10',
				desc: 'Phân tích doanh số bán hàng theo khu vực, sản phẩm và nhân viên.',
				content: 'Nội dung chi tiết báo cáo doanh số bán hàng tháng 10...',
				slug: 'bao-cao-doanh-so-thang-10',
				thumbnail: null,
				tag: 'internal',
				draft: false,
				view: 150
			},
			{
				title: 'Bài viết về trí tuệ nhân tạo trong y tế',
				desc: 'Khám phá các ứng dụng đột phá của AI trong chẩn đoán và điều trị bệnh.',
				content: 'Nội dung chi tiết về ứng dụng AI trong y tế...',
				slug: 'ai-trong-y-te',
				thumbnail: null,
				tag: 'external',
				draft: false,
				view: 200
			},
			{
				title: 'Thông báo về chính sách làm việc từ xa',
				desc: 'Thông tin chi tiết về các quy định và hướng dẫn làm việc từ xa.',
				content: 'Nội dung chi tiết về chính sách làm việc từ xa...',
				slug: 'chinh-sach-lam-viec-tu-xa',
				thumbnail: null,
				tag: 'internal',
				draft: false,
				view: 75
			},
			{
				title: 'Hướng dẫn tối ưu hóa SEO cho website thương mại điện tử',
				desc: 'Các bước chi tiết để cải thiện thứ hạng website trên công cụ tìm kiếm.',
				content: 'Nội dung chi tiết về tối ưu hóa SEO cho website thương mại điện tử...',
				slug: 'toi-uu-hoa-seo-ecommerce',
				thumbnail: null,
				tag: 'external',
				draft: false,
				view: 120
			},
			{
				title: 'Báo cáo hiệu suất dự án ABC',
				desc: 'Đánh giá tiến độ, ngân sách và các rủi ro của dự án ABC.',
				content: 'Nội dung chi tiết về hiệu suất dự án ABC...',
				slug: 'hieu-suat-du-an-abc',
				thumbnail: null,
				tag: 'internal',
				draft: false,
				view: 90
			},
			{
				title: 'Xu hướng Marketing kỹ thuật số năm 2024',
				desc: 'Phân tích các chiến lược marketing kỹ thuật số mới nhất, bao gồm AI, video ngắn và tương tác trực tiếp.',
				content: 'Nội dung chi tiết về xu hướng marketing kỹ thuật số 2024...',
				slug: 'xu-huong-marketing-2024',
				thumbnail: null,
				tag: 'external',
				draft: false,
				view: 180
			},
			{
				title: 'Hướng dẫn sử dụng hệ thống CRM mới',
				desc: 'Các bước cơ bản và nâng cao để sử dụng hiệu quả hệ thống CRM.',
				content: 'Nội dung chi tiết về hướng dẫn sử dụng hệ thống CRM...',
				slug: 'huong-dan-su-dung-crm',
				thumbnail: null,
				tag: 'internal',
				draft: false,
				view: 110
			},
			{
				title: 'Đánh giá sản phẩm: Điện thoại thông minh XYZ',
				desc: 'Đánh giá chi tiết về hiệu năng, camera, pin và thiết kế của điện thoại XYZ.',
				content: 'Nội dung chi tiết về đánh giá điện thoại thông minh XYZ...',
				slug: 'danh-gia-dien-thoai-xyz',
				thumbnail: null,
				tag: 'external',
				draft: false,
				view: 160
			},
			{
				title: 'Báo cáo đánh giá hiệu quả chiến dịch quảng cáo nội bộ',
				desc: 'Phân tích kết quả và đề xuất cải tiến cho các chiến dịch quảng cáo nội bộ.',
				content: 'Nội dung chi tiết về đánh giá chiến dịch quảng cáo nội bộ...',
				slug: 'danh-gia-chien-dich-quang-cao',
				thumbnail: null,
				tag: 'internal',
				draft: false,
				view: 80
			}
		];

		for (const blogData of blogs) {
			const existingBlog = await blogRepository.findOne({ where: { slug: blogData.slug } });
			if (!existingBlog) {
				const blog = blogRepository.create(blogData);
				await blogRepository.save(blog);
			}
		}

		console.log('Blogs have been seeded');
	}

	// async function seedComment() {
	// 	const commentRepository = manager.getRepository(CommentEntity);
	// 	const commentExist = await commentRepository.find();
	// 	if (commentExist.length > 0) {
	// 		return;
	// 	}

	// 	const blogRepository = manager.getRepository(BlogEntity);
	// 	const userRepository = manager.getRepository(UserEntity);

	// 	const blogs = await blogRepository.find();
	// 	const users = await userRepository.find({
	// 		where: {
	// 			role: { name: 'User' }
	// 		}
	// 	});

	// 	for (const blog of blogs) {
	// 		const comments = [
	// 			{ content: 'Comment for the first blog post', user: users[0], blog: blog },
	// 			{ content: 'Comment for the second blog post', user: users[1], blog: blog }
	// 		];

	// 		for (const commentData of comments) {
	// 			const existingComment = await commentRepository.findOne({
	// 				where: { content: commentData.content, blog: { id: blog.id } }
	// 			});
	// 			if (!existingComment) {
	// 				const comment = commentRepository.create(commentData);
	// 				await commentRepository.save(comment);
	// 			}
	// 		}
	// 	}
	// 	console.log('Comments have been seeded');
	// }

	// async function seedLike() {
	// 	const likeRepository = manager.getRepository(LikeEntity);
	// 	const likeExist = await likeRepository.find();
	// 	if (likeExist.length > 0) {
	// 		return;
	// 	}

	// 	const blogRepository = manager.getRepository(BlogEntity);
	// 	const userRepository = manager.getRepository(UserEntity);

	// 	const blogs = await blogRepository.find();
	// 	const users = await userRepository.find({
	// 		where: {
	// 			role: { name: 'User' }
	// 		}
	// 	});

	// 	for (const blog of blogs) {
	// 		const likes = [
	// 			{ user: users[0], blog: blog },
	// 			{ user: users[1], blog: blog }
	// 		];

	// 		for (const likeData of likes) {
	// 			const existingLike = await likeRepository.findOne({
	// 				where: { user: { id: likeData.user.id }, blog: { id: blog.id } }
	// 			});
	// 			if (!existingLike) {
	// 				const like = likeRepository.create(likeData);
	// 				await likeRepository.save(like);
	// 			}
	// 		}
	// 	}

	// 	console.log('Likes have been seeded');
	// }

	// async function seedWishList() {
	// 	const wishListRepository = manager.getRepository(WishListEntity);
	// 	const wishListExist = await wishListRepository.find();
	// 	if (wishListExist.length > 0) {
	// 		return;
	// 	}

	// 	const userRepository = manager.getRepository(UserEntity);
	// 	const productRepository = manager.getRepository(ProductEntity);

	// 	const users = await userRepository.find();
	// 	const products = await productRepository.find();

	// 	const wishLists = [];

	// 	users.forEach((user) => {
	// 		products.forEach((product) => {
	// 			wishLists.push({ user: user, product: product });
	// 		});
	// 	});

	// 	for (const wishListData of wishLists) {
	// 		const existingWishList = await wishListRepository.findOne({
	// 			where: {
	// 				user: { id: wishListData.user.id },
	// 				product: { id: wishListData.product.id }
	// 			}
	// 		});
	// 		if (!existingWishList) {
	// 			const wishList = wishListRepository.create(wishListData);
	// 			await wishListRepository.save(wishList);
	// 		}
	// 	}

	// 	console.log('Wish lists have been seeded');
	// }
};
