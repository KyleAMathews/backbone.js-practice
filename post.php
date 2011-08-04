<?php

$data = var_dump($_POST['answers']);
file_put_contents("/tmp/temp", $data);
print_r($_POST);
