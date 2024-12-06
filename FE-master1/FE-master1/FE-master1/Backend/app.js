const express = require('express');
const cors = require('cors');  // Import thư viện CORS
const app = express();
const port = 3000;
const connectToDatabase = require('./db');  // Kết nối tới SQL Server
const sql = require('mssql');  // Import thư viện MSSQL

// Middleware để xử lý dữ liệu JSON
app.use(express.json());  // Để nhận dữ liệu JSON trong body

// Sử dụng middleware CORS
app.use(cors({
  origin: '*'  // Cấu hình cho phép tất cả các nguồn truy cập API
}));

// API route chính (ví dụ: /getData)
// API lấy danh sách bài kiểm tra kết hợp với môn học
app.get('/getData', async (req, res) => {
  try {
    const pool = await connectToDatabase();  // Kết nối SQL Server
    const result = await pool.request()
      .query(`
        SELECT Test.TestID, Test.TestCode, Test.TestName, Test.NumberOfQuestions,
               Test.CreateDate, Test.UpdateDate, Subjects.SubjectsID AS SubjectsID
        FROM Test
        INNER JOIN Subjects ON Test.SubjectsID = Subjects.SubjectsID
        WHERE Test.IsDelete = 0
      `);  // Truy vấn SQL lấy dữ liệu bài kiểm tra kết hợp với môn học

    res.json(result.recordset);  // Trả về dữ liệu dưới dạng JSON
  } catch (err) {
    console.error('Lỗi khi truy vấn dữ liệu:', err);
    res.status(500).json({ message: 'Lỗi khi lấy dữ liệu', error: err });
  }
});

// API lấy danh sách môn học
app.get('/getSubjects', async (req, res) => {
  try {
    const pool = await connectToDatabase();  // Kết nối SQL Server
    const result = await pool.request()
      .query('SELECT SubjectsID, SubjectsName FROM Subjects WHERE IsDelete = 0');  // Truy vấn lấy SubjectID và SubjectName

    res.json(result.recordset);  // Trả về dữ liệu môn học dưới dạng JSON
  } catch (err) {
    console.error('Lỗi khi truy vấn dữ liệu môn học:', err);
    res.status(500).json({ message: 'Lỗi khi lấy dữ liệu môn học', error: err });
  }
});
app.get('/getExem', async (req, res) => {
  try {
    const pool = await connectToDatabase();  // Kết nối SQL Server
    const result = await pool.request()
      .query('SELECT Exam.ExamID, Exam.ExamCode, Exam.ExamName,Exam.ExamDate, Exam.Duration,Exam.NumberOfQuestions,Exam.TotalMarks,' +
        '               Exam.CreateDate, Exam.UpdateDate, Test.TestID AS TestID' +
        '        FROM Exam' +
        '        INNER JOIN Test ON Exam.TestID = Test.TestID' +
        '        WHERE Exam.IsDelete = 0');  // Truy vấn lấy SubjectID và SubjectName

    res.json(result.recordset);  // Trả về dữ liệu môn học dưới dạng JSON
  } catch (err) {
    console.error('Lỗi khi truy vấn dữ liệu bài thi:', err);
    res.status(500).json({ message: 'Lỗi khi lấy dữ liệu bài thi  ', error: err });
  }
});
app.get('/getQuestion', async (req, res) => {
  try {
    const pool = await connectToDatabase();  // Kết nối SQL Server
    const result = await pool.request()
      .query('SELECT QuestionType.QuestionTypeID, ' +
        'QuestionType.QuestionTypeCode, ' +
        'QuestionType.QuestionTypeName, ' +
        'QuestionType.CreateDate, ' +
        'QuestionType.UpdateDate ' +  // Thêm dấu cách sau mỗi trường
        'FROM QuestionType ' +
        'WHERE QuestionType.IsDelete = 0');  // Truy vấn lấy dữ liệu loại câu hỏi

    res.json(result.recordset);  // Trả về dữ liệu loại câu hỏi dưới dạng JSON
  } catch (err) {
    console.error('Lỗi khi truy vấn dữ liệu loại câu hỏi:', err);
    res.status(500).json({ message: 'Lỗi khi lấy dữ liệu loại câu hỏi', error: err });
  }
});

// API lấy danh sách sinh viên
app.get('/getStudents', async (req, res) => {
  try {
    const pool = await connectToDatabase(); // Kết nối SQL Server
    const result = await pool.request()
      .query(`
        SELECT StudentID, StudentCode, StudentName, Gender, NumberPhone, Address,
               BirthdayDate, CreateDate, UpdateDate, IsDelete, Email
        FROM Student
        WHERE IsDelete = 0
      `); // Truy vấn SQL lấy dữ liệu sinh viên

    res.json(result.recordset); // Trả về dữ liệu dưới dạng JSON
  } catch (err) {
    console.error('Lỗi khi truy vấn dữ liệu:', err);
    res.status(500).json({ message: 'Lỗi khi lấy dữ liệu', error: err });
  }
});


// API tạo mới sinh viên
app.post('/createStudent', async (req, res) => {
  const { StudentCode, StudentName, Gender, NumberPhone, Address, BirthdayDate, Email } = req.body;

  // Kiểm tra các trường bắt buộc
  if (!StudentCode || !StudentName || !Gender || !NumberPhone || !BirthdayDate || !Email) {
    return res.status(400).json({ message: 'Các trường bắt buộc: StudentCode, StudentName, Gender, NumberPhone, BirthdayDate, Email' });
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('StudentCode', sql.NVarChar, StudentCode)
      .input('StudentName', sql.NVarChar, StudentName)
      .input('Gender', sql.Bit, Gender)
      .input('NumberPhone', sql.NVarChar, NumberPhone)
      .input('Address', sql.NVarChar, Address || null) // Địa chỉ có thể không bắt buộc
      .input('BirthdayDate', sql.Date, BirthdayDate)
      .input('Email', sql.NVarChar, Email)
      .input('CreateDate', sql.DateTime, new Date())
      .input('UpdateDate', sql.DateTime, new Date())
      .input('IsDelete', sql.Bit, 0)
      .query(`
        INSERT INTO Student (StudentCode, StudentName, Gender, NumberPhone, Address, BirthdayDate, Email, CreateDate, UpdateDate, IsDelete)
        VALUES (@StudentCode, @StudentName, @Gender, @NumberPhone, @Address, @BirthdayDate, @Email, @CreateDate, @UpdateDate, @IsDelete)
      `);

    res.status(201).json({ message: 'Sinh viên được tạo thành công' });
  } catch (err) {
    console.error('Lỗi khi tạo dữ liệu:', err);
    res.status(500).json({ message: 'Lỗi khi tạo dữ liệu', error: err });
  }
});
// API cập nhật sinh viên
app.put('/updateStudent/:id', async (req, res) => {
  const { id } = req.params;
  const { StudentCode, StudentName, Gender, NumberPhone, Address, BirthdayDate, Email } = req.body;

  if (!StudentCode || !StudentName || !Gender || !NumberPhone || !BirthdayDate || !Email) {
    return res.status(400).json({ message: 'Các trường bắt buộc: StudentCode, StudentName, Gender, NumberPhone, BirthdayDate, Email' });
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('StudentCode', sql.NVarChar, StudentCode)
      .input('StudentName', sql.NVarChar, StudentName)
      .input('Gender', sql.Bit, Gender)
      .input('NumberPhone', sql.NVarChar, NumberPhone)
      .input('Address', sql.NVarChar, Address || null)
      .input('BirthdayDate', sql.Date, BirthdayDate)
      .input('Email', sql.NVarChar, Email)
      .input('UpdateDate', sql.DateTime, new Date())
      .query(`
        UPDATE Student
        SET StudentCode = @StudentCode, StudentName = @StudentName, Gender = @Gender,
            NumberPhone = @NumberPhone, Address = @Address, BirthdayDate = @BirthdayDate,
            Email = @Email, UpdateDate = @UpdateDate
        WHERE StudentID = @id AND IsDelete = 0
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sinh viên hoặc đã bị xóa' });
    }

    res.json({ message: 'Dữ liệu sinh viên được cập nhật thành công' });
  } catch (err) {
    console.error('Lỗi khi cập nhật dữ liệu:', err);
    res.status(500).json({ message: 'Lỗi khi cập nhật dữ liệu', error: err });
  }
});

// API Create - Thêm một bản ghi mới vào bảng Test
app.post('/createData', async (req, res) => {
  const { TestCode, TestName, NumberOfQuestions, SubjectsID } = req.body;

  // Kiểm tra các trường bắt buộc
  if (!TestCode || !TestName || !NumberOfQuestions || !SubjectsID) {
    return res.status(400).json({ message: 'TestCode, TestName, NumberOfQuestions, and SubjectsID are required' });
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('TestCode', sql.NVarChar, TestCode)
      .input('TestName', sql.NVarChar, TestName)
      .input('NumberOfQuestions', sql.Int, NumberOfQuestions)
      .input('SubjectsID', sql.Int, SubjectsID)  // Đảm bảo dùng SubjectsID
      .input('CreateDate', sql.DateTime, new Date())
      .input('UpdateDate', sql.DateTime, new Date())
      .input('IsDelete', sql.Bit, 0)
      .query(`
        INSERT INTO Test (TestCode, TestName, NumberOfQuestions, SubjectsID, CreateDate, UpdateDate, IsDelete)
        VALUES (@TestCode, @TestName, @NumberOfQuestions, @SubjectsID, @CreateDate, @UpdateDate, @IsDelete)
      `);

    res.status(201).json({ message: 'Data created successfully' });
  } catch (err) {
    console.error('Lỗi khi tạo dữ liệu:', err);
    res.status(500).json({ message: 'Lỗi khi tạo dữ liệu', error: err });
  }
});

// API Update - Cập nhật bản ghi trong bảng Test
// API Update - Cập nhật bản ghi trong bảng Test
// API Update - Cập nhật bản ghi trong bảng Test
app.put('/updateData/:id', async (req, res) => {
  const { id } = req.params;
  const { TestCode, TestName, NumberOfQuestions, SubjectsID } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!TestCode || !TestName || !NumberOfQuestions || !SubjectsID) {
    return res.status(400).json({ message: 'TestCode, TestName, NumberOfQuestions, and SubjectsID are required' });
  }

  try {
    const pool = await connectToDatabase();  // Kết nối SQL Server
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('TestCode', sql.NVarChar, TestCode)
      .input('TestName', sql.NVarChar, TestName)
      .input('NumberOfQuestions', sql.Int, NumberOfQuestions)
      .input('SubjectsID', sql.Int, SubjectsID)
      .input('UpdateDate', sql.DateTime, new Date())  // Set thời gian hiện tại cho UpdateDate
      .query(`
        UPDATE Test
        SET TestCode = @TestCode, TestName = @TestName, NumberOfQuestions = @NumberOfQuestions,
            SubjectsID = @SubjectsID, UpdateDate = @UpdateDate
        WHERE TestID = @id AND IsDelete = 0
      `);  // Truy vấn SQL để cập nhật bản ghi

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'Data not found or data is deleted' });
    }

    res.json({ message: 'Data updated successfully' });
  } catch (err) {
    console.error('Lỗi khi cập nhật dữ liệu:', err);
    res.status(500).json({ message: 'Lỗi khi cập nhật dữ liệu', error: err });
  }
});

// API Delete - Xóa một bản ghi trong bảng Test (Chỉ cập nhật trường IsDelete = 1)
app.delete('/deleteData/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await connectToDatabase();  // Kết nối SQL Server
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        UPDATE Test
        SET IsDelete = 1
        WHERE TestID = @id
      `);  // Truy vấn SQL để cập nhật trường IsDelete thành 1 (đánh dấu xóa)

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'Data not found or already deleted' });
    }

    res.json({ message: 'Data marked as deleted successfully' });
  } catch (err) {
    console.error('Lỗi khi xóa dữ liệu:', err);
    res.status(500).json({ message: 'Lỗi khi xóa dữ liệu', error: err });
  }
});

// API Create - Thêm bài thi mới
app.post('/createExam', async (req, res) => {
  const { ExamCode, ExamName, ExamDate, Duration, NumberOfQuestions, TotalMarks, TestID } = req.body;

  // Kiểm tra các trường bắt buộc
  if (!ExamCode || !ExamName || !ExamDate || !Duration || !NumberOfQuestions || !TotalMarks || !TestID) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('ExamCode', sql.NVarChar, ExamCode)
      .input('ExamName', sql.NVarChar, ExamName)
      .input('ExamDate', sql.DateTime, ExamDate)
      .input('Duration', sql.Int, Duration)
      .input('NumberOfQuestions', sql.Int, NumberOfQuestions)
      .input('TotalMarks', sql.Decimal(10, 2), TotalMarks)
      .input('TestID', sql.Int,TestID )
      .input('CreateDate', sql.DateTime, new Date())
      .input('UpdateDate', sql.DateTime, new Date())
      .input('IsDelete', sql.Bit, 0)
      .query(`
        INSERT INTO Exam (ExamCode, ExamName, ExamDate, Duration, NumberOfQuestions, TotalMarks, TestID, CreateDate, UpdateDate, IsDelete)
        VALUES (@ExamCode, @ExamName, @ExamDate, @Duration, @NumberOfQuestions, @TotalMarks, @TestID, @CreateDate, @UpdateDate, @IsDelete)
      `);

    res.status(201).json({ message: 'Exam created successfully' });
  } catch (err) {
    console.error('Lỗi khi tạo dữ liệu bài thi:', err);
    res.status(500).json({ message: 'Lỗi khi tạo bài thi', error: err });
  }
});
// API Update - Cập nhật bài thi
app.put('/updateExam/:id', async (req, res) => {
  const { id } = req.params;
  const { ExamCode, ExamName, ExamDate, Duration, NumberOfQuestions, TotalMarks, TestID } = req.body;

  // Kiểm tra các trường bắt buộc
  if (!ExamCode || !ExamName || !ExamDate || !Duration || !NumberOfQuestions || !TotalMarks || !TestID) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const pool = await connectToDatabase();  // Kết nối SQL Server
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('ExamCode', sql.NVarChar, ExamCode)
      .input('ExamName', sql.NVarChar, ExamName)
      .input('ExamDate', sql.DateTime, ExamDate)
      .input('Duration', sql.Int, Duration)
      .input('NumberOfQuestions', sql.Int, NumberOfQuestions)
      .input('TotalMarks', sql.Decimal(10, 2), TotalMarks)
      .input('TestID', sql.Int, TestID)
      .input('UpdateDate', sql.DateTime, new Date())  // Cập nhật thời gian
      .query(`
        UPDATE Exam
        SET ExamCode = @ExamCode, ExamName = @ExamName, ExamDate = @ExamDate, Duration = @Duration,
            NumberOfQuestions = @NumberOfQuestions, TotalMarks = @TotalMarks, TestID = @TestID, UpdateDate = @UpdateDate
        WHERE ExamID = @id AND IsDelete = 0
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'Exam not found or deleted' });
    }

    res.json({ message: 'Exam updated successfully' });
  } catch (err) {
    console.error('Lỗi khi cập nhật bài thi:', err);
    res.status(500).json({ message: 'Lỗi khi cập nhật bài thi', error: err });
  }
});
// API Delete - Xóa bài thi (đánh dấu IsDelete = 1)
app.delete('/deleteExam/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await connectToDatabase();  // Kết nối SQL Server
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        UPDATE Exam
        SET IsDelete = 1
        WHERE ExamID = @id
      `);  // Đánh dấu bài thi là bị xóa

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'Exam not found or already deleted' });
    }

    res.json({ message: 'Exam marked as deleted successfully' });
  } catch (err) {
    console.error('Lỗi khi xóa bài thi:', err);
    res.status(500).json({ message: 'Lỗi khi xóa bài thi', error: err });
  }
});

// API Create - Thêm loại câu hỏi
app.post('/createQuestion', async (req, res) => {
  const { QuestionTypeCode, QuestionTypeName } = req.body;

  // Kiểm tra các trường bắt buộc
  if (!QuestionTypeCode || !QuestionTypeName ) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('QuestionTypeCode', sql.NVarChar, QuestionTypeCode)
      .input('QuestionTypeName', sql.NVarChar, QuestionTypeName)
      .input('CreateDate', sql.DateTime, new Date())
      .input('UpdateDate', sql.DateTime, new Date())
      .input('IsDelete', sql.Bit, 0)
      .query(`
        INSERT INTO QuestionType (QuestionTypeCode, QuestionTypeName, CreateDate, UpdateDate, IsDelete)
        VALUES (@QuestionTypeCode, @QuestionTypeName, @CreateDate, @UpdateDate, @IsDelete)
      `);

    res.status(201).json({ message: 'QuesntionType created successfully' });
  } catch (err) {
    console.error('Lỗi khi tạo dữ liệu loại câu hỏi:', err);
    res.status(500).json({ message: 'Lỗi khi tạol oại câu hỏi', error: err });
  }
});
// API Update - Cập nhật loại câu hỏi
app.put('/updateQuestion/:id', async (req, res) => {
  const { id } = req.params;
  const { QuestionTypeCode,  QuestionTypeName } = req.body;

  // Kiểm tra các trường bắt buộc
  if (! QuestionTypeCode || ! QuestionTypeName) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const pool = await connectToDatabase();  // Kết nối SQL Server
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('QuestionTypeCode', sql.NVarChar, QuestionTypeCode)
      .input('QuestionTypeName', sql.NVarChar, QuestionTypeName)
      .query(`
        UPDATE  QuestionType
        SET  QuestionTypeCode = @ QuestionTypeCode,  QuestionTypeName = @ QuestionTypeName
        WHERE  QuestionTypeID = @id AND IsDelete = 0
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: ' QuestionType not found or deleted' });
    }

    res.json({ message: ' QuestionType updated successfully' });
  } catch (err) {
    console.error('Lỗi khi cập nhật loại câu hỏi:', err);
    res.status(500).json({ message: 'Lỗi khi cập nhật loại câu hỏi', error: err });
  }
});
// API Delete - Xóa bài thi (đánh dấu IsDelete = 1)
app.delete('/deleteQuestion/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await connectToDatabase();  // Kết nối SQL Server
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        UPDATE QuestionType
        SET IsDelete = 1
        WHERE QuestionTypeID = @id
      `);  // Đánh dấu bài thi là bị xóa

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'QuestionType not found or already deleted' });
    }

    res.json({ message: 'QuestionType marked as deleted successfully' });
  } catch (err) {
    console.error('Lỗi khi xóa loại câu hỏi:', err);
    res.status(500).json({ message: 'Lỗi khi xóa loại câu hỏi', error: err });
  }
});
// API xóa mềm sinh viên
app.delete('/deleteStudent/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        UPDATE Student
        SET IsDelete = 1
        WHERE StudentID = @id
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sinh viên hoặc đã bị xóa' });
    }

    res.json({ message: 'Sinh viên đã được đánh dấu là đã xóa' });
  } catch (err) {
    console.error('Lỗi khi xóa dữ liệu:', err);
    res.status(500).json({ message: 'Lỗi khi xóa dữ liệu', error: err });
  }
});
// API mặc định nếu truy cập /
app.get('/', (req, res) => {
  res.send('Hello World! API đang chạy...');
});

// Khởi động ứng dụng trên cổng 3000
app.listen(port, () => {
  console.log(`API đang chạy trên http://localhost:${port}`);
});
