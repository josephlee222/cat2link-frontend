import React, { useEffect, useRef } from 'react'
import { useState } from 'react'
import { Typography, Stack, IconButton, Button, Divider, Box, CircularProgress, Dialog, AppBar, Toolbar, useMediaQuery, useTheme, DialogContent, Chip, Grid2, TextField, MenuItem, Alert, ButtonBase, Card, CardContent, CardMedia, DialogContentText, DialogActions, DialogTitle } from '@mui/material'
import { useNavigate, Link } from 'react-router-dom';
import { WarningRounded, CloseRounded, MoreVertRounded, FileDownloadOffRounded, PersonRounded, EditRounded, RefreshRounded, Looks3Rounded, LooksTwoRounded, LooksOneRounded, CheckRounded, AccessTimeRounded, HourglassTopRounded, NewReleasesRounded, SaveRounded, EditOffRounded, UploadFileRounded, InsertDriveFileRounded, DownloadRounded, DeleteRounded, CategoryRounded } from '@mui/icons-material';
import { del, get, put } from 'aws-amplify/api';
import UserInfoPopover from './UserInfoPopover';
import TaskPopover from './TaskPopover';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { LoadingButton } from '@mui/lab';
import { enqueueSnackbar } from 'notistack';
import { FilePond } from 'react-filepond';
import http from '../http'

export default function ItemDialog(props) {
    const navigate = useNavigate()
    const [project, setProject] = useState(null)
    const [loading, setLoading] = useState(true)
    const [attachments, setAttachments] = useState([])
    const [attachmentLoading, setAttachmentLoading] = useState(true)
    const [attachmentError, setAttachmentError] = useState(false)
    const [error, setError] = useState(false)
    const [UserInfoPopoverOpen, setUserInfoPopoverOpen] = useState(false)
    const [UserInfoPopoverAnchorEl, setUserInfoPopoverAnchorEl] = useState(null)
    const [UserInfoPopoverUserId, setUserInfoPopoverUserId] = useState(null)
    const [TaskPopoverOpen, setTaskPopoverOpen] = useState(false)
    const [TaskPopoverAnchorEl, setTaskPopoverAnchorEl] = useState(null)
    const [editLoading, setEditLoading] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [loadingUploadAttachment, setLoadingUploadAttachment] = useState(false)
    const [deleteAttachment, setDeleteAttachment] = useState(null)
    const [deleteAttachmentOpen, setDeleteAttachmentOpen] = useState(false)
    const [deleteAttachmentLoading, setDeleteAttachmentLoading] = useState(false)
    const [category, setCategory] = useState([])
    const [filepondUrl, setFilepondUrl] = useState(null)
    const [filepondToken, setFilepondToken] = useState(null)
    const [newItemFiles, setNewItemFiles] = useState([])
    const filepondRef = useRef(null)
    const theme = useTheme()
    const api_url = import.meta.env.VITE_API_URL
    const bucket_url = import.meta.env.VITE_BUCKET_URL

    const editFormik = useFormik({
        initialValues: {
            name: "",
            description: "",
            categoryId: 1,
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Item name is required"),
            description: Yup.string().required("Description is required"),
            categoryId: Yup.number().required("Category is required"),
        }),
        onSubmit: async (values) => {
            if (values.name != project.name || values.description != project.description || values.categoryId != project.categoryId) {
                // Perform update
                setEditLoading(true)

                var data = {
                    name: values.name,
                    description: values.description,
                    categoryId: values.categoryId,
                }

                var req = put({
                    apiName: "midori",
                    path: "/admin/items/" + props.itemId,
                    options: {
                        body: {
                            ...data
                        }
                    }
                })

                try {
                    var res = await req.response
                    setEditLoading(false)
                    setEditMode(false)
                    handleGetProject(props.projectId)

                    // Call onUpdate function if it exists
                    if (props.onUpdate) {
                        props.onUpdate()
                    }
                } catch (err) {
                    console.log(err)
                    enqueueSnackbar("Failed to update project", { variant: "error" })
                    setEditLoading(false)
                }
            } else {
                setEditMode(false)
            }
        }
    })

    const handleGetProject = async (id) => {
        editMode && setEditMode(false)
        setLoading(true)
        handleGetAttachments(id)
        setError(false)
        http.get("/projects/" + id).then((res) => {
            if (res.status === 200) {
                var result = res.data
                console.log(result)
                setProject(result)
                editFormik.setValues({
                    name: result.name,
                    description: result.description,
                    categoryId: result.category.id,
                })
                setLoading(false)
            }
        }).catch((err) => {
                enqueueSnackbar("Failed to load project! " + err.response.data.message, { variant: "error" });
                setLoading(false)
            }
        )
    }

    const handleGetAttachments = async (id) => {
        setAttachmentLoading(true)
        var attachmentsReq = get({
            apiName: "midori",
            path: "/items/" + id + "/attachments",
        })

        try {
            var attachmentsRes = await attachmentsReq.response
            var attachmentsData = await attachmentsRes.body.json()
            setAttachments(attachmentsData)
            setAttachmentLoading(false)
        } catch (err) {
            console.log(err)
            setAttachmentError(true)
            setAttachmentLoading(false)
        }
    }

    const handleShowUserInformation = (e, userId) => {
        setUserInfoPopoverUserId(userId)
        setUserInfoPopoverAnchorEl(e.currentTarget)
        setUserInfoPopoverOpen(true)
    }

    const handleGetCategories = async () => {
        http.get("/categories/").then((res) => {
            if (res.status === 200) {
                var result = res.data
                console.log(result.reverse())
                setCategory(result)
                setLoading(false)
            }
        }).catch((err) => {
                enqueueSnackbar("Failed to load categories! " + err.response.data.message, { variant: "error" });
                setLoading(false)
            }
        )
    }

    const handleOptionsClick = (e) => {
        setTaskPopoverAnchorEl(e.currentTarget)
        setTaskPopoverOpen(true)
    }

    const handleDeleteAttachment = async () => {
        setDeleteAttachmentLoading(true)

        // /admin/items/{id}/attachments/{filename}
        var req = del({
            apiName: "midori",
            path: "/admin/items/" + props.itemId + "/attachments/" + deleteAttachment,
        })

        try {
            var res = await req.response
            setDeleteAttachmentLoading(false)
            handleGetAttachments(props.itemId)
            handleDeleteAttachmentClose()
            enqueueSnackbar("Attachment deleted", { variant: "success" })
        } catch (err) {
            console.log(err)
            setDeleteAttachmentLoading(false)
            enqueueSnackbar("Failed to delete attachment", { variant: "error" })
        }
    }

    const handleDeleteAttachmentOpen = (filename) => {
        setDeleteAttachment(filename)
        setDeleteAttachmentOpen(true)
    }

    const handleDeleteAttachmentClose = () => {
        setDeleteAttachmentOpen(false)
    }

    useEffect(() => {
        if (props.open && props.itemId) {
            handleGetProject(props.itemId)
            setFilepondToken(localStorage.getItem("token"))
            setFilepondUrl(api_url + "/admin/items/" + props.itemId + "/attachments")
        }
    }, [props.open])

    useEffect(() => {
        if (editMode) {
            handleGetCategories()
        }
    }, [editMode])

    return (
        <>
            <Dialog
                fullScreen={useMediaQuery(theme.breakpoints.down('md'))}
                open={props.open}
                onClose={props.onClose}
                maxWidth="md"
                fullWidth
            >
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={props.onClose}
                            aria-label="close"
                        >
                            <CloseRounded />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Project Details
                        </Typography>
                        {(project && !loading && !error && !editMode && !props.guestMode) && (
                            <Button onClick={() => setEditMode(true)} startIcon={<EditRounded />} color="inherit">Edit</Button>
                        )}
                        {(project && !loading && !error && editMode) && (
                            <>
                                <LoadingButton
                                    color="inherit"
                                    onClick={editFormik.handleSubmit}
                                    loading={editLoading}
                                    startIcon={<SaveRounded />}
                                    loadingPosition='start'
                                >
                                    Save
                                </LoadingButton>
                                <Button
                                    color="inherit"
                                    onClick={() => setEditMode(false)}
                                    startIcon={<EditOffRounded />}
                                    sx={{ ml: ".5rem" }}
                                >
                                    Cancel
                                </Button>
                            </>
                        )}
                    </Toolbar>
                </AppBar>
                <DialogContent>
                    {loading && (
                        <Stack direction={"column"} spacing={2} my={"3rem"} sx={{ justifyContent: "center", alignItems: "center" }}>
                            <CircularProgress />
                            <Typography variant="body1" color="grey">Loading project details...</Typography>
                        </Stack>
                    )}
                    {(!loading && error) && (
                        <Stack direction={"column"} spacing={2} my={"3rem"} sx={{ justifyContent: "center", alignItems: "center" }}>
                            <WarningRounded sx={{ height: "48px", width: "48px", color: "grey" }} />
                            <Typography variant="body1" color="grey">Failed to get project</Typography>
                            <Button variant="secondary" onClick={() => { handleGetProject(props.projectId) }} startIcon={<RefreshRounded />}>Retry</Button>
                        </Stack>
                    )}
                    {(!loading && !error && project) && (
                        <>
                            {(editMode) && (
                                <Alert severity="info" sx={{ mb: "1rem" }}>You are in edit mode. Make sure to save your changes.</Alert>
                            )}
                            <Grid2 container spacing={2}>
                                <Grid2 size={{ xs: 12, sm: 8, md: 9 }}>
                                    {editMode && (
                                        <>
                                            <Typography variant="body1" fontWeight={700}>Item Name</Typography>
                                            <TextField
                                                fullWidth
                                                id="name"
                                                name="name"
                                                hiddenLabel
                                                value={editFormik.values.name}
                                                onChange={editFormik.handleChange}
                                                error={editFormik.touched.name && Boolean(editFormik.errors.name)}
                                                helperText={editFormik.touched.name && editFormik.errors.name}
                                                sx={{ mb: "0.5rem" }}
                                                size='small'
                                            />
                                        </>
                                    )}
                                    {!editMode && (
                                        <Typography variant="h5" fontWeight={700}>{project.name}</Typography>
                                    )}
                                    <Typography fontSize={"0.75rem"} color='grey'>Project Year: {project.year}</Typography>
                                    <Divider sx={{ my: "0.5rem" }} />
                                    <Box mb={"1rem"}>
                                        <Typography variant="body1" fontWeight={700}>About the Project</Typography>
                                        {editMode && (
                                            <TextField
                                                fullWidth
                                                multiline
                                                minRows={5}
                                                id="description"
                                                name="description"
                                                hiddenLabel
                                                value={editFormik.values.description}
                                                onChange={editFormik.handleChange}
                                                error={editFormik.touched.description && Boolean(editFormik.errors.description)}
                                                helperText={editFormik.touched.description && editFormik.errors.description}
                                                sx={{ mb: "0.5rem" }}
                                                size='small'
                                            />
                                        )}
                                        {!editMode && (
                                            <>

                                                <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                                                    {project.description}
                                                </Typography>
                                            </>
                                        )}
                                    </Box>
                                    <Box>
                                        <Typography variant="body1" fontWeight={700} mb={"0.5rem"}>Gallery</Typography>
                                        {((!attachments || attachments.length == 0) && !attachmentLoading && !attachmentError) && (
                                            <Stack direction={"column"} spacing={'0.5rem'} py={"2rem"} sx={{ justifyContent: "center", alignItems: "center", borderRadius: "10px", border: "1px solid lightgrey" }}>
                                                <FileDownloadOffRounded sx={{ height: "32px", width: "32px", color: "grey" }} />
                                                <Typography variant="body1" color="grey">No Gallery Items</Typography>
                                            </Stack>
                                        )}
                                        {(!attachmentLoading && attachmentError) && (
                                            <Stack direction={"column"} spacing={'0.5rem'} py={"2rem"} sx={{ justifyContent: "center", alignItems: "center", borderRadius: "10px", border: "1px solid lightgrey" }}>
                                                <WarningRounded sx={{ height: "32px", width: "32px", color: "grey" }} />
                                                <Typography variant="body1" color="grey">Error loading gallery</Typography>
                                                <Button variant="secondary" onClick={() => { handleGetAttachments(props.taskId) }} startIcon={<RefreshRounded />}>Retry</Button>
                                            </Stack>
                                        )}
                                        {attachmentLoading && (
                                            <Stack direction={"column"} spacing={'0.5rem'} py={"2rem"} sx={{ justifyContent: "center", alignItems: "center", borderRadius: "10px", border: "1px solid lightgrey" }}>
                                                <CircularProgress />
                                                <Typography variant="body1" color="grey">Loading gallery...</Typography>
                                            </Stack>
                                        )}
                                        <Grid2 container spacing={1} mb={"1rem"}>
                                            {(attachments && !attachmentLoading) && attachments.map(attachment => (
                                                <Grid2 size={{ xs: 12, md: 6 }}>
                                                    <Card variant='outlined'>
                                                        <CardMedia
                                                            component="img"
                                                            height="150"
                                                            src={bucket_url + "/items/" + props.itemId + "/" + attachment.replace(" ", "+")}
                                                            sx={{ backgroundColor: "lightgrey", objectFit: "contain" }}
                                                        />
                                                        <CardContent>
                                                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                                                <InsertDriveFileRounded sx={{ color: "grey", mr: "0.5rem" }} />
                                                                <Box overflow={"hidden"}>
                                                                    <Typography variant="body1" fontWeight={700} sx={{ textOverflow: "ellipsis", width: "100%" }} noWrap>
                                                                        {attachment}
                                                                    </Typography>
                                                                    <Typography variant="body2">.{attachment.split(".").at(-1)} format</Typography>
                                                                </Box>
                                                            </Box>
                                                            <Stack direction={"row"} spacing={1} mt={"1rem"}>
                                                                <IconButton color={theme.palette.primary.main} size='small' LinkComponent={Link} to={api_url + "/items/" + props.itemId + "/attachments/" + attachment} target="_blank">
                                                                    <DownloadRounded />
                                                                </IconButton>
                                                                {!props.guestMode && (
                                                                    <IconButton color={theme.palette.primary.main} size='small' onClick={() => handleDeleteAttachmentOpen(attachment)}>
                                                                        <DeleteRounded />
                                                                    </IconButton>
                                                                )}
                                                            </Stack>
                                                        </CardContent>
                                                    </Card>
                                                </Grid2>
                                            )
                                            )}
                                        </Grid2>
                                        {!props.guestMode && (
                                            <FilePond
                                                ref={filepondRef}
                                                files={newItemFiles}
                                                allowMultiple={true}
                                                maxFiles={3}
                                                onupdatefiles={(fileItems) => {
                                                    setNewItemFiles(fileItems.map((fileItem) => fileItem.file));
                                                }}
                                                onprocessfiles={(error, file) => {
                                                    if (error) {
                                                        console.log(error);
                                                        enqueueSnackbar("Failed to upload attachments", { variant: "error" })
                                                    } else {
                                                        console.log(file);
                                                        handleGetAttachments(props.itemId)
                                                        setNewItemFiles([])
                                                        enqueueSnackbar("Attachments uploaded", { variant: "success" })
                                                    }
                                                }}
                                                credits={false}
                                                instantUpload={true}
                                                allowRevert={false}
                                                allowProcess={true}
                                                allowReplace={false}
                                                allowReorder={true}
                                                acceptedFileTypes={['image/*']}
                                                imagePreviewMaxHeight={200}
                                                server={{
                                                    url: filepondUrl,
                                                    process: {
                                                        method: 'POST',
                                                        headers: {
                                                            Authorization: filepondToken
                                                        },
                                                    },
                                                }}
                                            ></FilePond>
                                        )}
                                    </Box>
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                                    <Grid2 container spacing={2}>
                                        <Grid2 size={{ xs: 12 }}>
                                            <Typography variant="body1" fontWeight={700}>Category</Typography>
                                            {editMode && (
                                                <TextField
                                                    select
                                                    fullWidth
                                                    id="categoryId"
                                                    name="categoryId"
                                                    hiddenLabel
                                                    value={editFormik.values.categoryId}
                                                    onChange={editFormik.handleChange}
                                                    error={editFormik.touched.categoryId && Boolean(editFormik.errors.categoryId)}
                                                    helperText={editFormik.touched.categoryId && editFormik.errors.categoryId}
                                                    size='small'

                                                >
                                                    {category.map((cat) => (
                                                        <MenuItem key={cat.id} value={cat.id}>
                                                            {cat.name}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            )}
                                            {!editMode && (
                                                <>
                                                    <Chip icon={<CategoryRounded />} label={project.category.name} color="info" size='small' />
                                                </>
                                            )}

                                        </Grid2>
                                        <Grid2 size={{ xs: 12 }}>
                                            <Typography variant="body1" fontWeight={700}>Group Members</Typography>
                                            <Chip icon={<PersonRounded />} label={project.created_by} size='small' onClick={(e) => { handleShowUserInformation(e, project.created_by) }} />
                                        </Grid2>
                                    </Grid2>
                                </Grid2>
                            </Grid2>
                        </>
                    )}
                </DialogContent>
            </Dialog>
            <Dialog
                open={deleteAttachmentOpen}
                onClose={handleDeleteAttachmentClose}
                fullWidth
            >
                <DialogTitle>
                    Delete Attachment
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this attachment?
                        <br />
                        Filename: {deleteAttachment}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteAttachmentClose} color="primary" startIcon={<CloseRounded />}>
                        Cancel
                    </Button>
                    <LoadingButton
                        color="error"
                        onClick={handleDeleteAttachment}
                        loading={deleteAttachmentLoading}
                        startIcon={<DeleteRounded />}
                        loadingPosition='start'
                    >
                        Delete
                    </LoadingButton>
                </DialogActions>
            </Dialog>
            <UserInfoPopover open={UserInfoPopoverOpen} anchor={UserInfoPopoverAnchorEl} onClose={() => setUserInfoPopoverOpen(false)} userId={UserInfoPopoverUserId} />
        </>

    )
}