import React from 'react';
import './LuatSan.scss';

const LuatSan = () => {
  return (
    <div className="luat-san-container">
      <h2>Chính sách sân bóng</h2>  
      <div className="content1">
        <p>
          Cảm ơn quý khách đã tin tưởng và sử dụng hệ thống sân bóng của chúng tôi. Chúng tôi rất vinh hạnh khi được phục vụ quý khách.
        </p>
        <p>
          Để đảm bảo quý khách có thể đặt sân và sử dụng dịch vụ tại sân bóng của chúng tôi một cách an toàn và tốt nhất.
        </p>
        <p>
          Sân bóng HELLO chúng tôi chuyên cung cấp các dịch vụ thể thao liên quan tới bóng đá. Sân bóng của chúng tôi đạt chuẩn FIFA mang lại sự an toàn khi thi đấu.
        </p>
        <p>
          Website "Đặt lịch sân bóng HELLO" của chúng tôi hoạt động 24/24 quý khách có thể tự chọn giờ và đặt sân bất cứ thời gian nào.
        </p>
      </div>
      <div className="note">
        <h2>Tuy nhiên chúng tôi có 1 số lưu ý cho quý khách như sau:</h2>
        <ol>
          <li>
            Phần trăm tiền cọc sẽ do chủ sân quyết định (50%) (Không bao gồm dịch vụ). Sau khi quý khách đã chuyển tiền, hệ thống sẽ gửi thông báo đến quý khách để xác nhận quý khách đã đặt lịch thành công.
          </li>
          <li>
            Dịch vụ của chúng tôi sẽ hỗ trợ quý khách đổi lịch sân trước khoảng thời gian do chủ sân cung cấp đến (mặc định 1 ngày) ngày lịch đặt của quý khách.
          </li>
          <li>
            Khi đến sân quý khách vui lòng cung cấp mã QR check-in nhận sân. Nếu người đặt sân không có mặt tại sân, đội quý khách vui lòng cung cấp số điện thoại người đặt để nhận sân. Mọi quyết định sẽ được đưa ra ngay thời điểm, và quyết định của chủ sân sẽ là quyết định cuối cùng.
          </li>
          <li>
            Nếu quý khách có nhu cầu đặt sân gấp, chúng tôi khuyến cáo quý khách nên liên hệ tới số 0989666666 để đặt sân trực tiếp thông qua nhân viên trực tại sân.
          </li>
        </ol>
      </div>
    </div>
  );
};

export default LuatSan;
