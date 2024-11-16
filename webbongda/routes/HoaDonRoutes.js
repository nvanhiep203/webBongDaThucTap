const router = require('express').Router()
const HoaDon = require('../models/HoaDonModels')
const Booking = require('../models/BookingModels')
const SanBong = require('../models/SanBongModels')
const Ca = require('../models/CaModels')
const LoaiSanBong = require('../models/LoaiSanBongModels')
const DoThue = require('../models/DoThueModels')
const DoUong = require('../models/DoUongModels')
const LichSu = require('../models/LichSuModels')
const momenttimezone = require('moment-timezone')
const moment = require('moment')

router.get('/gethoadon', async (req, res) => {
  try {
    const hoadon = await HoaDon.find().lean()
    const hoadon1 = hoadon.filter(h => h.thanhtoan === false)
    const hoadonjson = await Promise.all(
      hoadon1.map(async hd => {
        const booking = await Booking.findById(hd.booking)
        const sanbong = await SanBong.findById(booking.sanbong)
        const loaisanbong = await LoaiSanBong.findById(booking.loaisanbong)
        const ca = await Ca.findById(booking.ca)

        const bookingjson = {
          _id: booking._id,
          hovaten: booking.tennguoidat,
          phone: booking.phone,
          sanbong: sanbong.tensanbong,
          loaisanbong: loaisanbong.tenloaisan,
          ca: ca.tenca,
          giaca: ca.giaca,
          begintime: moment(ca.begintime).format('HH:mm'),
          endtime: moment(ca.endtime).format('HH:mm'),
          ngayda: moment(booking.ngayda).format('DD-MM-YYYY'),
          ngaydat: booking.ngaydat
        }
        const dothue = await Promise.all(
          hd.dothue.map(async dt => {
            const dt1 = await DoThue.findById(dt.iddothue)
            return {
              _id: dt1._id,
              tendothue: dt1.tendothue,
              image: dt1.image,
              soluong: dt.soluong,
              thanhtien: dt.tien
            }
          })
        )
        const douong = await Promise.all(
          hd.douong.map(async du => {
            const du1 = await DoUong.findById(du.iddouong)
            return {
              _id: du1._id,
              tendouong: du1.tendouong,
              image: du1.image,
              soluong: du.soluong,
              thanhtien: du.tien
            }
          })
        )

        return {
          idhoadon: hd._id,
          mahd: hd.mahd,
          booking: bookingjson,
          dothue: dothue,
          douong: douong,
          date: moment(hd.date).format('YYYY-MM-DD HH:mm:ss'),
          tiencoc: hd.tiencoc,
          phuphi: hd.phuphi || 0,
          tongtien: hd.tongtien,
          thanhtoan: hd.thanhtoan
        }
      })
    )
    res.json(hoadonjson)
  } catch (error) {
    console.error('đã xảy ra lỗi:', error)
    res.status(500).json({ error: 'Đã xảy ra lỗi' })
  }
})

router.get('/getfullhoadon', async (req, res) => {
  try {
    const hoadon = await HoaDon.find().lean()
    const hoadonjson = await Promise.all(
      hoadon.map(async hd => {
        const booking = await Booking.findById(hd.booking)
        const sanbong = await SanBong.findById(booking.sanbong)
        const loaisanbong = await LoaiSanBong.findById(booking.loaisanbong)
        const ca = await Ca.findById(booking.ca)

        const bookingjson = {
          _id: booking._id,
          hovaten: booking.tennguoidat,
          phone: booking.phone,
          sanbong: sanbong.tensanbong,
          loaisanbong: loaisanbong.tenloaisan,
          ca: ca.tenca,
          giaca: ca.giaca,
          begintime: moment(ca.begintime).format('HH:mm'),
          endtime: moment(ca.endtime).format('HH:mm'),
          ngayda: moment(booking.ngayda).format('DD-MM-YYYY'),
          ngaydat: booking.ngaydat
        }
        const dothue = await Promise.all(
          hd.dothue.map(async dt => {
            const dt1 = await DoThue.findById(dt.iddothue)
            return {
              _id: dt1._id,
              tendothue: dt1.tendothue,
              image: dt1.image,
              soluong: dt.soluong,
              thanhtien: dt.tien
            }
          })
        )
        const douong = await Promise.all(
          hd.douong.map(async du => {
            const du1 = await DoUong.findById(du.iddouong)
            return {
              _id: du1._id,
              tendouong: du1.tendouong,
              image: du1.image,
              soluong: du.soluong,
              thanhtien: du.tien
            }
          })
        )

        return {
          idhoadon: hd._id,
          mahd: hd.mahd,
          booking: bookingjson,
          dothue: dothue,
          douong: douong,
          date: moment(hd.date).format('YYYY-MM-DD HH:mm:ss'),
          tiencoc: hd.tiencoc,
          phuphi: hd.phuphi || 0,
          tongtien: hd.tongtien,
          thanhtoan: hd.thanhtoan
        }
      })
    )
    res.json(hoadonjson)
  } catch (error) {
    console.error('đã xảy ra lỗi:', error)
    res.status(500).json({ error: 'Đã xảy ra lỗi' })
  }
})

router.get('/gethoadontest', async (req, res) => {
  try {
    // Tìm các hóa đơn chưa thanh toán và sử dụng `populate` để lấy các liên kết
    const hoadon = await HoaDon.find({ thanhtoan: false })
      .populate({
        path: 'booking',
        populate: [
          { path: 'sanbong', select: 'tensan' },
          { path: 'loaisanbong', select: 'tenloaisan' },
          { path: 'ca', select: 'tenca giaca begintime endtime' }
        ]
      })
      .populate('dothue.iddothue', 'tendothue image')
      .populate('douong.iddouong', 'tendouong image')
      .lean() // Chuyển đổi sang plain JavaScript object để dễ xử lý

    // Định dạng lại kết quả sau khi lấy dữ liệu populate
    const hoadonjson = hoadon.map(hd => {
      // Định dạng thông tin booking
      const booking = hd.booking
      const bookingjson = {
        _id: booking._id,
        hovaten: booking.tennguoidat,
        phone: booking.phone,
        sanbong: booking.sanbong?.tensan || null,
        loaisanbong: booking.loaisanbong?.tenloaisan || null,
        ca: booking.ca?.tenca || null,
        giaca: booking.ca?.giaca || null,
        begintime: booking.ca
          ? moment(booking.ca.begintime).format('HH:mm')
          : null,
        endtime: booking.ca ? moment(booking.ca.endtime).format('HH:mm') : null,
        ngayda: moment(booking.ngayda).format('DD-MM-YYYY'),
        ngaydat: booking.ngaydat
      }

      // Định dạng thông tin đồ thuê
      const dothue = hd.dothue.map(dt => ({
        _id: dt.iddothue._id,
        tendothue: dt.iddothue.tendothue,
        image: dt.iddothue.image,
        soluong: dt.soluong,
        thanhtien: dt.tien
      }))

      // Định dạng thông tin đồ uống
      const douong = hd.douong.map(du => ({
        _id: du.iddouong._id,
        tendouong: du.iddouong.tendouong,
        image: du.iddouong.image,
        soluong: du.soluong,
        thanhtien: du.tien
      }))

      // Định dạng thông tin hóa đơn
      return {
        idhoadon: hd._id,
        mahd: hd.mahd,
        booking: bookingjson,
        dothue: dothue,
        douong: douong,
        tongtien: hd.tongtien
      }
    })

    res.json(hoadonjson)
  } catch (error) {
    console.error('đã xảy ra lỗi:', error)
    res.status(500).json({ error: 'Đã xảy ra lỗi' })
  }
})

router.post('/posthoadon/:idhoadon/:idbooking', async (req, res) => {
  try {
    const { phuphi, method, sotaikhoan, nganhang, tienkhachtra, tienthua } =
      req.body
    const idhoadon = req.params.idhoadon
    const idbooking = req.params.idbooking
    const hoadon = await HoaDon.findById(idhoadon)

    const booking = await Booking.findById(idbooking)
    hoadon.phuphi = phuphi
    hoadon.method = method
    hoadon.thanhtoan = true
    booking.thanhtoan = true
    hoadon.date = momenttimezone().toDate()

    const tongTienDothue = hoadon.dothue.reduce(
      (sum, item) => sum + item.tien,
      0
    )
    const tongTienDouong = hoadon.douong.reduce(
      (sum, item) => sum + item.tien,
      0
    )

    hoadon.tongtien =
      hoadon.giasan -
      hoadon.tiencoc +
      tongTienDothue +
      tongTienDouong +
      parseFloat(phuphi)

    const tongtien =
      hoadon.giasan -
      hoadon.tiencoc +
      tongTienDothue +
      tongTienDouong +
      parseFloat(phuphi)

    if (method === 'chuyển khoản') {
      hoadon.sotaikhoan = sotaikhoan
      hoadon.nganhang = nganhang
    }
    if (method === 'tiền mặt') {
      hoadon.tienkhachtra = tienkhachtra
      hoadon.tienthua = tienthua
    }
    const lichsu = new LichSu({
      hovaten: booking.tennguoidat,
      sodienthoai: booking.phone,
      method: method,
      ngaygio: momenttimezone().toDate(),
      tongtien: tongtien,
      noiDung: 'Thanh toán hóa đơn'
    })
    await booking.save()
    await lichsu.save()
    await hoadon.save()
    res.json(hoadon)
  } catch (error) {
    console.error('đã xảy ra lỗi:', error)
    res.status(500).json({ error: 'Đã xảy ra lỗi' })
  }
})

router.get('/doanhthu', async (req, res) => {
  try {
    const { startDate, endDate } = req.query

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ error: 'Vui lòng cung cấp startDate và endDate' })
    }

    const start = new Date(startDate)
    const end = new Date(endDate)
    end.setHours(23, 59, 59, 999)

    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ error: 'Ngày không hợp lệ' })
    }

    // Tạo danh sách tất cả các ngày trong khoảng thời gian
    const generateDateRange = (start, end) => {
      const dates = []
      const currentDate = new Date(start)

      while (currentDate <= end) {
        dates.push(new Date(currentDate).toISOString().split('T')[0]) // Chỉ lấy phần ngày
        currentDate.setDate(currentDate.getDate() + 1)
      }

      return dates
    }

    const allDates = generateDateRange(start, end)

    // Lấy dữ liệu doanh thu từ MongoDB
    const doanhThuTheoNgay = await LichSu.aggregate([
      {
        $match: {
          ngaygio: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$ngaygio' } },
          tongDoanhThu: { $sum: '$tongtien' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ])

    // Chuyển đổi kết quả MongoDB thành đối tượng {ngay: doanhThu}
    const doanhThuMap = doanhThuTheoNgay.reduce((acc, item) => {
      acc[item._id] = item.tongDoanhThu
      return acc
    }, {})

    // Kết hợp tất cả các ngày với doanh thu
    const finalResult = allDates.map(date => ({
      ngay: date,
      tongDoanhThu: doanhThuMap[date] || 0 // Giá trị mặc định là 0 nếu không có doanh thu
    }))

    res.json(finalResult)
  } catch (error) {
    console.error('Đã xảy ra lỗi:', error)
    res.status(500).json({ error: 'Đã xảy ra lỗi khi tính doanh thu' })
  }
})

router.get('/lichsugiaodich', async (req, res) => {
  try {
    const lichsu = await LichSu.find().lean()
    const lichsujson = lichsu.map(ls => {
      return {
        maGD: ls.maGD,
        hovaten: ls.hovaten,
        sodienthoai: ls.sodienthoai,
        method: ls.method,
        ngaygio: moment(ls.ngaygio).format('DD-MM-YYYY HH:mm:ss'),
        tongtien: ls.tongtien,
        noiDung: ls.noiDung
      }
    })
    res.json(lichsujson)
  } catch (error) {
    console.error('Đã xảy ra lỗi:', error)
    res.status(500).json({ error: 'Đã xảy ra lỗi ' })
  }
})

module.exports = router
